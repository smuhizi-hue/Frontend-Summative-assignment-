import { storage } from './storage.js';
import { state } from './state.js';
import { validators } from './validators.js';
import { search } from './search.js';
import { ui } from './ui.js';

const dom = {
  dashboardCards: document.getElementById('dashboard-cards'),
  trendChart: document.getElementById('trend-chart'),
  recordsList: document.getElementById('records-list'),
  recordError: document.getElementById('record-error'),
  searchInput: document.getElementById('search-input'),
  searchCase: document.getElementById('search-case'),
  sortSelect: document.getElementById('sort-select'),
  recordForm: document.getElementById('record-form'),
  titleInput: document.getElementById('title-input'),
  dueDateInput: document.getElementById('due-date-input'),
  tagInput: document.getElementById('tag-input'),
  titleError: document.getElementById('title-error'),
  dueDateError: document.getElementById('dueDate-error'),
  tagError: document.getElementById('tag-error'),
  formReset: document.getElementById('form-reset'),
  importJson: document.getElementById('import-json'),
  importError: document.getElementById('import-error'),
  exportJson: document.getElementById('export-json')
};

function loadState(){
  const stored = storage.load();
  state.initialize(stored.records, stored.settings);
  syncSettings();
}
function saveState(){ storage.save(state); }
function syncSettings(){
  dom.unitRadios.forEach(r=>r.checked = r.value === state.settings.unit);
  dom.weeklyTarget.value = state.settings.weeklyTarget;
}

function makeId(){ return `task_${Date.now().toString(36)}`; }
function buildRecord(data,id=null){
  return { id: id||data.id||makeId(), title:data.title.trim(), dueDate:data.dueDate, duration:Number(data.duration), tag:data.tag.trim(), createdAt: data.createdAt||new Date().toISOString(), updatedAt: new Date().toISOString() };
}

function resetForm(){ dom.recordForm.reset(); state.activeRecordId=null; dom.titleError.textContent=''; dom.dueDateError.textContent=''; dom.durationError.textContent=''; dom.tagError.textContent=''; }
function showErrors(e){ dom.titleError.textContent=e.title||''; dom.dueDateError.textContent=e.dueDate||''; dom.durationError.textContent=e.duration||''; dom.tagError.textContent=e.tag||''; }
function getFormData(){ return { title:dom.titleInput.value, dueDate:dom.dueDateInput.value, duration:dom.durationInput.value, tag:dom.tagInput.value }; }

function computeStats(records){
  const totalRecords = records.length;
  const totalDuration = records.reduce((s,r)=>s+(Number(r.duration)||0),0);
  const freq = records.reduce((a,r)=>{ a[r.tag]=(a[r.tag]||0)+1; return a; },{});
  const topTag = Object.keys(freq).reduce((t,k)=>freq[k]>(freq[t]||0)?k:t,'None')||'None';
  const targetStatus = totalDuration <= state.settings.weeklyTarget ? 'Under target' : 'Target exceeded';
  return { totalRecords, totalDuration:`${totalDuration} min`, topTag, targetStatus };
}
function buildTrend(records){ const now=new Date(); const values=Array(7).fill(0); records.forEach(r=>{ const d=new Date(r.dueDate); const diff=Math.floor((d-now)/(1000*60*60*24)); if(diff>=0 && diff<7) values[diff]+=Number(r.duration)||0; }); return values.reverse(); }

function renderDashboard(){ dom.dashboardCards.innerHTML = ui.renderDashboard(computeStats(state.records)); dom.trendChart.innerHTML = ui.renderTrend(buildTrend(state.records)); const status = computeStats(state.records).targetStatus; const live = status==='Under target'?'polite':'assertive'; dom.dashboardCards.setAttribute('aria-live', live); }

function sortRecords(records){ const [key,dir]=dom.sortSelect.value.split('-'); return [...records].sort((a,b)=>{ if(key==='title') return dir==='asc'? a.title.localeCompare(b.title): b.title.localeCompare(a.title); if(key==='duration') return dir==='asc'? a.duration-b.duration: b.duration-a.duration; const da=new Date(a.dueDate); const db=new Date(b.dueDate); return dir==='asc'? da-db: db-da; }); }

function renderRecords(){ const q=dom.searchInput.value.trim(); const regex = search.compile(q, dom.searchCase.checked); if(q && !regex){ dom.recordError.textContent='Invalid regex pattern.'; dom.recordsList.innerHTML=''; return; } dom.recordError.textContent=''; const filtered = search.filter(sortRecords(state.records), regex); dom.recordsList.innerHTML = filtered.map(r=>ui.createCard(r, state.settings.unit, regex)).join(''); }

function populateForm(rec){ dom.titleInput.value=rec.title; dom.dueDateInput.value=rec.dueDate; dom.durationInput.value=rec.duration; dom.tagInput.value=rec.tag; state.activeRecordId=rec.id; }

function handleSave(e){ e.preventDefault(); const data=getFormData(); const record=buildRecord(data, state.activeRecordId); const errs=validators.validateRecord(record); if(Object.keys(errs).length){ showErrors(errs); return; } if(state.activeRecordId){ const existing=state.getRecord(state.activeRecordId); state.updateRecord(state.activeRecordId, { ...record, createdAt: existing?.createdAt }); } else { state.addRecord(record); } saveState(); resetForm(); renderDashboard(); renderRecords(); }

function handleListClick(e){ const id=e.target.dataset.id; if(!id) return; if(e.target.classList.contains('edit-btn')){ const r=state.getRecord(id); if(r) populateForm(r); } if(e.target.classList.contains('delete-btn')){ if(!confirm('Delete this record?')) return; state.deleteRecord(id); saveState(); renderDashboard(); renderRecords(); } }

function handleUnitChange(){ const v=document.querySelector('input[name="unit"]:checked').value; state.setSettings({ unit:v }); saveState(); renderRecords(); }
function handleTargetChange(){ state.setSettings({ weeklyTarget:Number(dom.weeklyTarget.value)||300 }); saveState(); renderDashboard(); }

function handleExport(){ const payload={ records: state.records, settings: state.settings }; const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='task-tracker.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
function handleImport(e){ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const parsed=JSON.parse(r.result); let records=[], imported={}; if(Array.isArray(parsed)) records=parsed; else if(parsed && Array.isArray(parsed.records)){ records=parsed.records; imported=parsed.settings||{}; } else throw new Error('Invalid JSON'); const valid = records.every(rec=>rec.id && rec.title && rec.dueDate && rec.duration!=null && rec.tag && rec.createdAt && rec.updatedAt); if(!valid) throw new Error('JSON missing fields'); state.initialize(records, {...state.settings, ...imported}); saveState(); syncSettings(); renderDashboard(); renderRecords(); dom.importError.textContent=''; }catch(err){ dom.importError.textContent=err.message; } finally{ e.target.value=''; } }; r.readAsText(f); }

function init(){ loadState(); renderDashboard(); renderRecords(); dom.recordForm.addEventListener('submit', handleSave); dom.formReset.addEventListener('click', resetForm); dom.recordsList.addEventListener('click', handleListClick); dom.searchInput.addEventListener('input', renderRecords); dom.searchCase.addEventListener('change', renderRecords); dom.sortSelect.addEventListener('change', renderRecords); dom.unitRadios.forEach(r=>r.addEventListener('change', handleUnitChange)); dom.weeklyTarget.addEventListener('input', handleTargetChange); dom.exportJson.addEventListener('click', handleExport); dom.importJson.addEventListener('change', handleImport);
}

init();

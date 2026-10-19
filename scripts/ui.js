export const ui = {
  createCard(record, regex=null){
    return `
      <article class="record-card" data-id="${record.id}">
        <h3>${regex? ui.highlight(record.title,regex):record.title}</h3>
        <div class="record-meta">
          <span>Due: ${regex? ui.highlight(record.dueDate,regex):record.dueDate}</span>
          <span>Tag: ${regex? ui.highlight(record.tag,regex):record.tag}</span>
        </div>
        <div class="record-actions">
          <button class="btn btn-secondary btn-small edit-btn" data-id="${record.id}">Edit</button>
          <button class="btn btn-secondary btn-small delete-btn" data-id="${record.id}">Delete</button>
        </div>
      </article>
    `;
  },
  highlight(text, regex){ return String(text).replace(regex,m=>`<mark>${m}</mark>`); },
  renderDashboard(stats){
    return [
      {label:'Total records', value:stats.totalRecords},
      {label:'Top tag', value:stats.topTag},
    ].map(c=>`<div class="dashboard-card"><h3>${c.label}</h3><p>${c.value}</p></div>`).join('');
  },
  renderTrend(values){ if(!values || !values.length) return '';
    const max = Math.max(...values,1);
    return values.map(v=>`<div class="trend-bar" style="height:${Math.max(14,(v/max)*100)}px" title="${v} ></div>`).join('');
  }
};

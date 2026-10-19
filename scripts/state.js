export const state = {
  records: [],
  activeRecordId: null,

  initialize(records = [], settings = {}) {
    this.records = Array.isArray(records) ? records : [];
  },
  getRecord(id) { return this.records.find(r => r.id === id) || null; },
  addRecord(record) { this.records.push(record); },
  updateRecord(id, updates) {
    const rec = this.getRecord(id);
    if (rec) Object.assign(rec, updates, { updatedAt: new Date().toISOString() });
  },
  deleteRecord(id) { this.records = this.records.filter(r => r.id !== id); },
};

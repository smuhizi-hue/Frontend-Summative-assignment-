export const storage = {
  key: 'TaskTracker:data',
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return { records: [], settings: {} };
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return { records: parsed, settings: {} };
      return { records: Array.isArray(parsed.records) ? parsed.records : [], settings: parsed.settings || {} };
    } catch (e) {
      console.error('storage.load', e);
      return { records: [], settings: {} };
    }
  },
  save(state) {
    try {
      localStorage.setItem(this.key, JSON.stringify({ records: state.records, settings: state.settings }));
    } catch (e) { console.error('storage.save', e); }
  }
};
export const search = {
  compile(query, caseSensitive = false) {
    if (!query) return null;
    // support @tag:word shorthand
    if (/^@tag:\w+$/.test(query)) return new RegExp(`^${query.replace('@tag:','')}$`, caseSensitive ? '' : 'i');
    try { return new RegExp(query, caseSensitive ? '' : 'i'); } catch (e) { return null; }
  },
  filter(records, regex) {
    if (!regex) return records;
    return records.filter(r => regex.test(r.title) || regex.test(r.tag) || regex.test(r.dueDate));
  },
  highlight(text, regex) { if (!regex) return text; return String(text).replace(regex, m => `<mark>${m}</mark>`); }
};
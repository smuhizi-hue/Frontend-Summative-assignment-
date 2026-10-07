export const validators = {
  patterns: {
    title: /^\S(?:.*\S)?$/,
    duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    dueDate: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    duplicateWords: /\b(\w+)\s+\1\b/i,
    tagSearch: /^@tag:\w+$/,
    timeToken: /\b\d{2}:\d{2}\b/g
  },
  validateTitle(v) { return this.patterns.title.test(v) && !this.patterns.duplicateWords.test(v); },
  validateDuration(v) { return this.patterns.duration.test(String(v)); },
  validateDueDate(v) { return this.patterns.dueDate.test(v); },
  validateTag(v) { return this.patterns.tag.test(v); },
  validateRecord(r) {
    const errs = {};
    if (!this.validateTitle(r.title)) errs.title = 'Invalid title (no leading/trailing spaces or duplicate words).';
    if (!this.validateDuration(r.duration)) errs.duration = 'Invalid duration (positive number, up to 2 decimals).';
    if (!this.validateDueDate(r.dueDate)) errs.dueDate = 'Invalid date (YYYY-MM-DD).';
    if (!this.validateTag(r.tag)) errs.tag = 'Invalid tag (letters, spaces, hyphens only).';
    return errs;
  }
};
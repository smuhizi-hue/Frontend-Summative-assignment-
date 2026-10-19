export const validators = {
  patterns: {
    title: /^\S(?:.*\S)?$/,
    dueDate: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    duplicateWords: /\b(\w+)\s+\1\b/i,
    tagSearch: /^@tag:\w+$/,
    timeToken: /\b\d{2}:\d{2}\b/g
  },
  validateTitle(v) { return this.patterns.title.test(v) && !this.patterns.duplicateWords.test(v); },
  validateDueDate(v) { return this.patterns.dueDate.test(v); },
  validateTag(v) { return this.patterns.tag.test(v); },
  validateRecord(r) {
    const errs = {};
    if (!this.validateTitle(r.title)) errs.title = 'Invalid title (no leading/trailing spaces or duplicate words).';
    if (!this.validateDueDate(r.dueDate)) errs.dueDate = 'Invalid date (YYYY-MM-DD).';
    if (!this.validateTag(r.tag)) errs.tag = 'Invalid tag (letters, spaces, hyphens only).';
    return errs;
  }
};

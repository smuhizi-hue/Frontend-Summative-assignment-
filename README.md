# Task Tracker

Simple HTML/CSS/JS task tracker for students.

## Run
Open `index.html` in a browser.

## Files
- `index.html` — main app
- `styles/main.css` — styling
- `scripts/*.js` — modules
- `seed.json` — example records
- `tests.html` — regex tests

## Features
- Add/Edit/Delete records with timestamps
- Regex search with highlight
- Sorting and filtering
- Import/Export JSON
- LocalStorage persistence

## Regex catalog
- Title: `^\\S(?:.*\\S)?$`
- Duration: `^(0|[1-9]\\d*)(\\.\\d{1,2})?$`
- Date: `^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$`
- Tag: `^[A-Za-z]+(?:[ -][A-Za-z]+)*$`
- Dup words: `\\b(\\w+)\\s+\\1\\b`


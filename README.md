# Task Tracker

Simple HTML/CSS/JS task tracker for students.

## Run
Because the app uses JavaScript modules, run it through a local web server rather than opening `index.html` directly with `file://`.

For example, in VS Code you can use the Live Server extension and choose **Open with Live Server** on `index.html`. Alternatively, from the project folder run:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

The task list starts empty unless you have saved tasks in this browser already. To load the example tasks, use **Import JSON** and select `seed.json`.

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

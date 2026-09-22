# Copilot Instructions — Flask Sudoku

## Project goals
- Refactor legacy Sudoku code into a modern Flask app.
- Keep logic modular: generator, solver, routes, frontend.
- Use Python 3.11+, Flask, plain CSS, and vanilla JS.
- Include tests with pytest.

## Code style
- Use type hints where practical.
- Add docstrings for public functions.
- Use small, reusable functions.
- Prefer clear names over clever shortcuts.
- Handle errors gracefully and return JSON errors for API routes.

## Frontend
- Semantic HTML.
- Responsive layout for mobile and desktop.
- CSS variables for light/dark mode.
- 3x3 Sudoku boxes must alternate background colors.
- Keep text readable in both themes.
- Use localStorage for the Top 10 leaderboard and theme preference.

## Game rules
- 9x9 grid.
- Rows, columns, and 3x3 boxes must contain 1–9 without repeats.
- Prefilled cells are locked.
- Invalid moves get immediate visual feedback.
- Hint fills one correct empty cell and locks it.
- Check highlights incorrect entries.
- Completion shows a congratulatory message.
"""Entry point for the Flask Sudoku app."""
from sudoku import create_app

app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
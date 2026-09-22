"""Flask routes for the Sudoku game."""
from __future__ import annotations

from flask import Blueprint, jsonify, render_template, request

from .generator import generate_puzzle

bp = Blueprint("main", __name__)


@bp.get("/")
def index():
    """Render the main Sudoku page."""
    return render_template("index.html")


@bp.get("/api/new")
def new_game():
    """Generate a new puzzle at the requested difficulty."""
    difficulty = request.args.get("difficulty", "easy").lower()

    try:
        puzzle, solution = generate_puzzle(difficulty)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    return jsonify(
        {
            "puzzle": puzzle,
            "solution": solution,
            "difficulty": difficulty,
        }
    )
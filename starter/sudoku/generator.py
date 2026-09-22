"""Sudoku puzzle generator with difficulty levels and unique solutions."""
from __future__ import annotations

import copy
import random
from typing import Literal, TypeAlias

from .solver import Board, EMPTY, SIZE, count_solutions, fill_board


DIFFICULTY_CLUES = {
    "easy": 40,
    "medium": 32,
    "hard": 26,
}
Difficulty: TypeAlias = Literal["easy", "medium", "hard"]


def _target_clues(difficulty: str) -> int:
    """Return the clue target for a supported difficulty."""
    if not isinstance(difficulty, str):
        raise ValueError("difficulty must be easy, medium, or hard")

    normalized = difficulty.lower()
    if normalized not in DIFFICULTY_CLUES:
        raise ValueError("difficulty must be easy, medium, or hard")
    return DIFFICULTY_CLUES[normalized]


def generate_puzzle(difficulty: Difficulty = "easy") -> tuple[Board, Board]:
    """
    Generate a Sudoku puzzle with a unique solution.

    Returns a tuple of (puzzle, solution).
    Difficulty controls how many clues remain.
    """
    target_clues = _target_clues(difficulty)

    while True:
        full_board: Board = [[EMPTY] * SIZE for _ in range(SIZE)]
        if not fill_board(full_board):
            continue

        solution = copy.deepcopy(full_board)
        puzzle = copy.deepcopy(full_board)
        cells = [(row, col) for row in range(SIZE) for col in range(SIZE)]
        random.shuffle(cells)

        clues = SIZE * SIZE
        for row, col in cells:
            if clues == target_clues:
                break

            backup = puzzle[row][col]
            puzzle[row][col] = EMPTY
            if count_solutions(puzzle, limit=2) == 1:
                clues -= 1
            else:
                puzzle[row][col] = backup

        if clues == target_clues:
            return puzzle, solution
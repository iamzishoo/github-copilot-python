"""Sudoku solving and generation helpers."""

from __future__ import annotations

import copy
import random
from typing import Optional, TypeAlias

SIZE = 9
EMPTY = 0
Board: TypeAlias = list[list[int]]


def find_empty(board: Board) -> Optional[tuple[int, int]]:
    """Return the first empty cell as (row, col), or None if full."""
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == EMPTY:
                return row, col
    return None


def is_safe(board: Board, row: int, col: int, num: int) -> bool:
    """Return whether ``num`` can be placed at ``(row, col)``."""
    for index in range(SIZE):
        if board[row][index] == num or board[index][col] == num:
            return False

    box_row = row - row % 3
    box_col = col - col % 3
    for current_row in range(box_row, box_row + 3):
        for current_col in range(box_col, box_col + 3):
            if board[current_row][current_col] == num:
                return False
    return True


def fill_board(board: Board) -> bool:
    """Fill ``board`` with a randomized valid solution in place."""
    empty = find_empty(board)
    if empty is None:
        return True

    row, col = empty
    candidates = list(range(1, SIZE + 1))
    random.shuffle(candidates)
    for candidate in candidates:
        if is_safe(board, row, col, candidate):
            board[row][col] = candidate
            if fill_board(board):
                return True
            board[row][col] = EMPTY
    return False


def is_valid(board: Board, num: int, pos: tuple[int, int]) -> bool:
    """Compatibility wrapper for checking a candidate position."""
    return is_safe(board, pos[0], pos[1], num)


def solve(board: Board) -> Optional[Board]:
    """Solve a Sudoku board. Returns the solved board or None if unsolvable."""
    empty = find_empty(board)
    if empty is None:
        return board

    r, c = empty
    for num in range(1, SIZE + 1):
        if is_safe(board, r, c, num):
            board[r][c] = num
            result = solve(board)
            if result is not None:
                return result
            board[r][c] = EMPTY

    return None


def count_solutions(board: Board, limit: int = 2) -> int:
    """
    Count how many solutions a board has, up to limit.
    Used to verify that a puzzle has exactly one solution.
    """
    if limit < 1:
        raise ValueError("limit must be at least 1")

    work = copy.deepcopy(board)

    def _count(b: Board) -> int:
        empty = find_empty(b)
        if empty is None:
            return 1

        r, c = empty
        total = 0
        for num in range(1, SIZE + 1):
            if is_safe(b, r, c, num):
                b[r][c] = num
                total += _count(b)
                b[r][c] = EMPTY
                if total >= limit:
                    return total
        return total

    return _count(work)
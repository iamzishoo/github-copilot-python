from sudoku.solver import count_solutions, fill_board, is_safe


def test_fill_board_creates_a_valid_solution():
    board = [[0] * 9 for _ in range(9)]

    assert fill_board(board)
    assert count_solutions(board) == 1


def test_count_solutions_caps_multiple_solutions():
    board = [[0] * 9 for _ in range(9)]

    assert count_solutions(board) == 2
    assert is_safe(board, 0, 0, 1)
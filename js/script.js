const tbody = document.querySelector("tbody");
const td = document.querySelectorAll("td");
const dialog = document.querySelector("dialog");
const restartBtn = document.querySelector(".restart-btn");
var CURRENTTURN = 1;
var P1SCORE = 0;
var P2SCORE = 0;

function init_score() {
    P1SCORE = 0;
    var p1ScoreArea = document.querySelector(".p1-score");
    p1ScoreArea.innerHTML = "0";
    P2SCORE = 0;
    var p2ScoreArea = document.querySelector(".p2-score");
    p2ScoreArea.innerHTML = "0";

    const turnMessage = document.querySelector(".turn-message");
    turnMessage.textContent = `P1's turn`;
}

function init_table() {
    td.forEach((elem) => {
        elem.setAttribute("val", "-1");
        elem.innerHTML = "";
    });
    const turnMessage = document.querySelector(".turn-message");
    turnMessage.textContent = `P${CURRENTTURN}'s turn`;
}

function load_current_table() {
    var matrix = [
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1],
    ];
    td.forEach((elem) => {
        col_idx = parseInt(elem.getAttribute("col"));
        row_idx = parseInt(elem.getAttribute("row"));
        val = parseInt(elem.getAttribute("val"));

        matrix[row_idx][col_idx] = val;
    });

    return matrix;
}

function print_matrix(matrix) {
    for (var i = 0; i < 3; i++) {
        console.log(
            matrix[i][0] + " " + matrix[i][1] + " " + matrix[i][2] + " "
        );
    }
}

function place_tic_tac(row, col, player) {
    // 把那個拿出來
    var result = null;
    td.forEach((elem) => {
        if (
            elem.getAttribute("row") == row.toString() &&
            elem.getAttribute("col") == col.toString()
        ) {
            result = elem;
        }
    });
    // 檢查當前這個位置可不可以下棋
    let val = result.getAttribute("val");
    if (val != "-1") return;

    // 依據 player
    if (player == 1) {
        result.setAttribute("val", "1");
        // 建立一個 img
        var img = document.createElement("img");
        img.setAttribute("src", "img/circle-svgrepo-com.svg");
        result.append(img);
    } else {
        result.setAttribute("val", "2");
        var img = document.createElement("img");
        img.setAttribute("src", "img/cross-icon.svg");
        result.append(img);
    }
}
/*
 * 檢查是否連成一線， -1 的話可以直接斷開
 */
function check_if_win() {
    var matrix = load_current_table();
    // horizontal ---

    for (var i = 0; i < 3; i++) {
        var val1 = matrix[i][0];
        var val2 = matrix[i][1];
        var val3 = matrix[i][2];
        // console.log(val1, val2, val3);
        if (val1 != -1 && val2 != -1 && val3 != -1) {
            if (val1 == val2 && val2 == val3) {
                return val1;
            }
        }
    }

    // vertical |
    for (var i = 0; i < 3; i++) {
        var val1 = matrix[0][i];
        var val2 = matrix[1][i];
        var val3 = matrix[2][i];
        if (val1 != -1 && val2 != -1 && val3 != -1) {
            if (val1 == val2 && val2 == val3) {
                return val1;
            }
        }
    }
    // anti-diag \
    if (matrix[0][0] != -1 && matrix[1][1] != -1 && matrix[2][2] != -1) {
        if (matrix[0][0] == matrix[1][1] && matrix[1][1] == matrix[2][2])
            return matrix[0][0];
    }
    // anti-diag /
    if (matrix[0][2] != -1 && matrix[1][1] != -1 && matrix[2][0] != -1) {
        if (matrix[0][2] == matrix[1][1] && matrix[1][1] == matrix[2][0])
            return matrix[0][2];
    }

    return -1;
}

function checkIsTie() {
    var matrix = load_current_table();
    var flag = true;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (matrix[i][j] == -1) flag = false;
        }
    }
    return flag;
}

async function is_win(lastTurn) {
    await new Promise((r) => setTimeout(r, 200));

    if (lastTurn == 1) {
        P1SCORE++;
        var p1ScoreArea = document.querySelector(".p1-score");
        p1ScoreArea.textContent = P1SCORE;
        p1ScoreArea.parentNode.append(p1ScoreArea);
    } else if (lastTurn == 2) {
        P2SCORE++;
        var p2ScoreArea = document.querySelector(".p2-score");
        p2ScoreArea.textContent = P2SCORE;
        p2ScoreArea.parentNode.append(p2ScoreArea);
    }
    var winMessage = document.querySelector("h3");
    winMessage.textContent = `玩家 ${lastTurn} 贏了!`;
    dialog.append(winMessage);
    dialog.showModal();
    init_table();
}

async function is_tie() {
    await new Promise((r) => setTimeout(r, 200));
    var winMessage = document.querySelector("h3");
    winMessage.textContent = `平手`;
    dialog.append(winMessage);
    dialog.showModal();
    init_table();
}

dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
    if (!isInDialog) {
        dialog.close();
    }
});

restartBtn.addEventListener("click", () => {
    init_score();
    //restart永遠從P1開始
    td.forEach((elem) => {
        elem.setAttribute("val", "-1");
        elem.innerHTML = "";
    });
    const turnMessage = document.querySelector(".turn-message");
    turnMessage.textContent = `P1's turn`;
    CURRENTTURN = 1;
});

function handleEvent(row_idx, col_idx) {
    // 先打牌
    place_tic_tac(row_idx, col_idx, CURRENTTURN);

    // 檢查誰贏
    var res = check_if_win();
    if (res != -1) {
        is_win(CURRENTTURN);
    }

    // 檢查平手
    var tie = checkIsTie();
    if (tie && res == -1) {
        is_tie();
    }

    // 換回合
    CURRENTTURN = CURRENTTURN == 1 ? 2 : 1;
    const turnMessage = document.querySelector(".turn-message");
    turnMessage.textContent = `P${CURRENTTURN} 's turn`
    console.log(`現在回合 ${CURRENTTURN}`);
}

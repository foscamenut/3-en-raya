let board = ["","","","","","","","",""];
let gameOver = false;

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

// 🎮 Crear tablero
function createBoard() {
    boardEl.innerHTML = "";

    board.forEach((cell, i) => {
        let div = document.createElement("div");
        div.className = "cell";
        div.innerText = cell;
        div.onclick = () => playerMove(i);
        boardEl.appendChild(div);
    });
}

// 🧍 Movimiento jugador
function playerMove(i) {
    if (board[i] !== "" || gameOver) return;

    board[i] = "X";
    updateBoard();

    if (checkWinner("X")) {
        statusEl.innerText = "🎉 Has ganado";
        gameOver = true;
        return;
    }

    if (board.every(c => c !== "")) {
        statusEl.innerText = "🤝 Empate";
        gameOver = true;
        return;
    }

    statusEl.innerText = "Turno de la IA...";
    setTimeout(aiMove, 500);
}

// 🤖 IA
function aiMove() {
    let difficulty = document.getElementById("difficulty").value;
    let move;

    if (difficulty === "easy") {
        move = randomMove();
    } else if (difficulty === "medium") {
        move = Math.random() < 0.5 ? randomMove() : bestMove();
    } else {
        move = bestMove();
    }

    board[move] = "O";
    updateBoard();

    if (checkWinner("O")) {
        statusEl.innerText = "🤖 La IA gana";
        gameOver = true;
        return;
    }

    if (board.every(c => c !== "")) {
        statusEl.innerText = "🤝 Empate";
        gameOver = true;
        return;
    }

    statusEl.innerText = "Tu turno";
}

// 🎲 Movimiento aleatorio
function randomMove() {
    let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    return empty[Math.floor(Math.random()*empty.length)];
}

// 🧠 IA perfecta (Minimax)
function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(isMax) {
    if (checkWinner("O")) return 1;
    if (checkWinner("X")) return -1;
    if (board.every(c => c !== "")) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                best = Math.max(best, minimax(false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                best = Math.min(best, minimax(true));
                board[i] = "";
            }
        }
        return best;
    }
}

// 🏆 Comprobar ganador
function checkWinner(p) {
    const w = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return w.some(c => c.every(i => board[i] === p));
}

// 🔄 Actualizar tablero
function updateBoard() {
    document.querySelectorAll(".cell").forEach((c,i)=>c.innerText=board[i]);
}

// 🔁 Reiniciar
function resetGame() {
    board = ["","","","","","","","",""];
    gameOver = false;
    statusEl.innerText = "Tu turno";
    createBoard();
}

// 🚀 Inicio
createBoard();
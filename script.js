let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let currentPlayer = 'circle';
let gameOver = false;

function generateCircleSVG() {
    return `
        <svg width="40px" height="40px" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="#00B0EF" stroke-width="4" fill="none">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0, 113.097" 
                    to="113.097, 113.097" 
                    dur="0.6s" 
                    fill="freeze" />
            </circle>
        </svg>
    `;
}

function generateCrossSVG() {
    return `
        <svg width="40px" height="40px" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="10" x2="30" y2="30" stroke="#FF0000" stroke-width="4">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0, 28.284" 
                    to="28.284, 28.284" 
                    dur="0.6s" 
                    fill="freeze" />
            </line>
            <line x1="30" y1="10" x2="10" y2="30" stroke="#FF0000" stroke-width="4">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0, 28.284" 
                    to="28.284, 28.284" 
                    dur="0.6s" 
                    fill="freeze" />
            </line>
        </svg>
    `;
}

function handleCellClick(index) {
    if (!fields[index] && !gameOver) {
        fields[index] = currentPlayer;
        let cell = document.getElementById(`cell-${index}`);
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null; // Entfernt den onclick-Handler

        const winningCombination = checkWin();
        if (winningCombination) {
            gameOver = true;
            drawWinningLine(winningCombination);
        } else {
            currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        }
    }
}

function checkWin() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return combination;
        }
    }
    return null;
}

function drawWinningLine(combination) {
    const [a, , c] = combination;

    const cellA = document.getElementById(`cell-${a}`);
    const cellC = document.getElementById(`cell-${c}`);
    const cellABox = cellA.getBoundingClientRect();
    const cellCBox = cellC.getBoundingClientRect();
    const contentBox = document.getElementById('content').getBoundingClientRect();

    const startX = cellABox.left + (cellABox.width / 2) - contentBox.left;
    const startY = cellABox.top + (cellABox.height / 2) - contentBox.top;
    const endX = cellCBox.left + (cellCBox.width / 2) - contentBox.left;
    const endY = cellCBox.top + (cellCBox.height / 2) - contentBox.top;

    const svgOverlay = document.getElementById('svg-overlay');
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", startX);
    line.setAttribute("y2", startY);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "4");
    line.setAttribute("id", "winning-line");

    svgOverlay.appendChild(line);

    setTimeout(() => {
        line.setAttribute("x2", endX);
        line.setAttribute("y2", endY);
    }, 50);
}

function resetGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ];
    currentPlayer = 'circle';
    gameOver = false;
    render();
}

function render() {
    let table = '<table>';
    for (let i = 0; i < 3; i++) {
        table += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let field = fields[index];
            let content = '';
            if (field === 'circle') {
                content = generateCircleSVG();
            } else if (field === 'cross') {
                content = generateCrossSVG();
            }
            table += `<td id="cell-${index}" class="${field ? field : ''}" onclick="handleCellClick(${index})">${content}</td>`;
        }
        table += '</tr>';
    }
    table += '</table>';
    document.getElementById('content').innerHTML = table;

    // Append an SVG overlay to draw the winning line
    const svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.setAttribute("id", "svg-overlay");
    svgOverlay.setAttribute("width", "100%");
    svgOverlay.setAttribute("height", "100%");
    svgOverlay.setAttribute("style", "position:absolute;top:0;left:0;pointer-events:none;");
    document.getElementById('content').appendChild(svgOverlay);

    // Append the restart button
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.classList.add('restart-button'); // Add class for styling
    restartButton.onclick = resetGame;
    document.getElementById('content').appendChild(restartButton);
}

// Initialer Aufruf der render-Funktion, um die Tabelle zu generieren
render();

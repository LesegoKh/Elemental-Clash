let playerScore = 0;
let computerScore = 0;
let roundCount = 0;
const totalRounds = 3;
let playerName = '';
const elements = ['fire', 'water', 'earth', 'air'];
const playerElements = document.querySelectorAll('.element-button');
const resultDisplay = document.getElementById('result');
const scoreDisplay = document.getElementById('score');
const winnerDisplay = document.getElementById('winnerDisplay');
const namePrompt = document.getElementById('namePrompt');
const playerNameInput = document.getElementById('playerNameInput');
const submitNameButton = document.getElementById('submitNameButton');
const pastMovesDisplay = document.getElementById('pastMoves');
const resultsTable = document.getElementById('resultsTable');

const pastMoves = [];

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

submitNameButton.addEventListener('click', () => {
    playerName = playerNameInput.value || "Player";
    namePrompt.textContent = `Welcome, ${playerName}! Ready to play?`;
    const myModal = bootstrap.Modal.getInstance(document.getElementById('nameModal'));
    myModal.hide();
});

const getComputerChoice = () => {
    return elements[Math.floor(Math.random() * elements.length)];
};

const determineRoundResult = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) return "It's a tie!";
    if (
        (playerChoice === 'fire' && computerChoice === 'earth') ||
        (playerChoice === 'water' && computerChoice === 'fire') ||
        (playerChoice === 'earth' && computerChoice === 'air') ||
        (playerChoice === 'air' && computerChoice === 'water')
    ) {
        playerScore += 1000;
        computerScore += 0; 
        return `You win this round! ${capitalize(playerChoice)} beats ${capitalize(computerChoice)}.`;
    } else {
        computerScore += 1000; 
        playerScore += 0; 
        return `You lose this round! ${capitalize(computerChoice)} beats ${capitalize(playerChoice)}.`;
    }
};

const updateScore = () => {
    scoreDisplay.textContent = `Score: Player ${playerScore} - Computer ${computerScore}`;
    scoreDisplay.classList.add("score-scale");
    setTimeout(() => {
        scoreDisplay.classList.remove("score-scale");
    }, 500);
};

const displayWinner = () => {
    const finalResult = playerScore > computerScore ? playerName : "Computer";
    winnerDisplay.textContent = `Winner: ${finalResult}! Final Score: Player ${playerScore} - Computer ${computerScore}`;
    winnerDisplay.classList.add("flash");

 
    if (finalResult === playerName) {
        floodWinningEmojis();
    }

    
    updateResultsTable();

    
    resetGame();
};

const floodWinningEmojis = () => {
    const emojiContainer = document.createElement('div');
    emojiContainer.style.position = 'fixed';
    emojiContainer.style.top = '0';
    emojiContainer.style.left = '0';
    emojiContainer.style.width = '100vw'; 
    emojiContainer.style.height = '100vh'; 
    emojiContainer.style.pointerEvents = 'none'; 
    emojiContainer.style.display = 'flex';
    emojiContainer.style.flexWrap = 'wrap';
    emojiContainer.style.justifyContent = 'center';
    emojiContainer.style.alignItems = 'center';
    document.body.appendChild(emojiContainer);

    const emojis = ['🎉', '🏆', '🎊', '🥳', '✨']; 

    for (let i = 0; i < 50; i++) { 
        const emoji = document.createElement('div');
        emoji.className = 'emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.fontSize = '2rem'; 
        emoji.style.animation = 'float 4s ease-in-out forwards'; 
        emoji.style.margin = '5px'; 

        emojiContainer.appendChild(emoji);

        
        emoji.addEventListener('animationend', () => {
            emoji.remove();
        });
    }
};

const updateResultsTable = () => {
   
    resultsTable.innerHTML = `
        <tr>
            <th>Round</th>
            <th>Player Choice</th>
            <th>Computer Choice</th>
            <th>Result</th>
            <th>Points</th>
        </tr>
    `;

    pastMoves.forEach((move, index) => {
        const [round, playerChoice, computerChoice, result] = move.split('|');
        const points = result.includes("win") ? "1000" : result.includes("lose") ? "0" : "-";
        resultsTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${capitalize(playerChoice)}</td>
                <td>${capitalize(computerChoice)}</td>
                <td>${result}</td>
                <td>${points}</td>
            </tr>
        `;
    });

    resultsTable.innerHTML += `
        <tr>
            <td colspan="4"><strong>Total Score</strong></td>
            <td><strong>Player: ${playerScore} - Computer: ${computerScore}</strong></td>
        </tr>
    `;
};

const resetGame = () => {
    roundCount = 0;
    playerScore = 0;
    computerScore = 0;
    pastMoves.length = 0; 
};

playerElements.forEach(element => {
    element.addEventListener("click", function() {
        const playerChoice = this.id;
        const computerChoice = getComputerChoice();
        const result = determineRoundResult(playerChoice, computerChoice);

        pastMoves.push(`${++roundCount}|${playerChoice}|${computerChoice}|${result}`);
        updateScore();
        resultDisplay.textContent = result;

        if (roundCount === totalRounds) {
            displayWinner();
        }
    });
});

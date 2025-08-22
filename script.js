class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.matchedPairs = 0;
        this.totalPairs = 8;
        this.gameStarted = false;
        this.timer = 0;
        this.timerInterval = null;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        // Create card pairs with emojis
        const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        const cardValues = [...emojis, ...emojis];
        
        // Shuffle the cards
        this.cards = this.shuffleArray(cardValues);
        
        // Generate the game board
        this.generateGameBoard();
        
        // Reset game state
        this.resetGameState();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    generateGameBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        this.cards.forEach((value, index) => {
            const card = document.createElement('div');
            card.className = 'card w-20 h-20 md:w-24 md:h-24';
            card.dataset.index = index;
            card.dataset.value = value;
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
                        ?
                    </div>
                    <div class="card-back bg-white rounded-lg flex items-center justify-center text-3xl md:text-4xl">
                        ${value}
                    </div>
                </div>
            `;
            
            gameBoard.appendChild(card);
        });
    }

    resetGameState() {
        this.flippedCards = [];
        this.moves = 0;
        this.matchedPairs = 0;
        this.gameStarted = false;
        this.timer = 0;
        
        document.getElementById('moves').textContent = '0';
        document.getElementById('timer').textContent = '0s';
        document.getElementById('win-message').classList.add('hidden');
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reset all cards
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('flipped', 'matched');
        });
    }

    setupEventListeners() {
        const gameBoard = document.getElementById('game-board');
        const restartBtn = document.getElementById('restart-btn');
        
        gameBoard.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
                this.flipCard(card);
            }
        });
        
        restartBtn.addEventListener('click', () => {
            this.initializeGame();
        });
    }

    flipCard(card) {
        if (this.flippedCards.length === 2) return;
        
        if (!this.gameStarted) {
            this.startGame();
        }
        
        card.classList.add('flipped');
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            document.getElementById('moves').textContent = this.moves;
            this.checkForMatch();
        }
    }

    startGame() {
        this.gameStarted = true;
        this.timerInterval = setInterval(() => {
            this.timer++;
            document.getElementById('timer').textContent = `${this.timer}s`;
        }, 1000);
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.dataset.value === card2.dataset.value) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;
            
            this.flippedCards = [];
            
            if (this.matchedPairs === this.totalPairs) {
                this.endGame();
            }
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.flippedCards = [];
            }, 1000);
        }
    }

    endGame() {
        clearInterval(this.timerInterval);
        
        document.getElementById('final-moves').textContent = this.moves;
        document.getElementById('final-time').textContent = this.timer;
        document.getElementById('win-message').classList.remove('hidden');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});

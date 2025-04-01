document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const introScreen = document.getElementById('intro-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const bonusScreen = document.getElementById('bonus-screen');
    
    const startBtn = document.getElementById('start-btn');
    const optionBtns = document.querySelectorAll('.option-btn');
    const nextKickBtn = document.getElementById('next-kick-btn');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const restartBtn = document.getElementById('restart-btn');
    const continueBtn = document.getElementById('continue-btn');
    
    const ball = document.getElementById('ball');
    const keeper = document.getElementById('keeper');
    
    const currentLevelText = document.getElementById('current-level');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    
    // Game variables
    let currentLevel = 1;
    let successfulKicks = 0;
    let keeperPosition = 'center';
    
    // Level configurations
    const levels = {
        1: {
            name: "Tập Sự",
            successRate: 0.8, // 80% chance to score
            keeperSpeed: 1000 // milliseconds to move
        },
        2: {
            name: "Trung Cấp",
            successRate: 0.5, // 50% chance to score
            keeperSpeed: 700
        },
        3: {
            name: "Chuyên Gia",
            successRate: 0.3, // 30% chance to score
            keeperSpeed: 400
        }
    };
    
    // Initialize game
    function initGame() {
        currentLevelText.textContent = levels[currentLevel].name;
        successfulKicks = 0;
        updateProgress();
        showScreen(introScreen);
    }
    
    // Update progress display
    function updateProgress() {
        const progressPercent = (successfulKicks / 9) * 100;
        progressBar.style.width = `${progressPercent}%`;
        progressText.textContent = `${successfulKicks}/9`;
    }
    
    // Show a specific screen and hide others
    function showScreen(screen) {
        [introScreen, gameScreen, resultScreen, bonusScreen].forEach(s => {
            s.classList.add('hidden');
        });
        screen.classList.remove('hidden');
    }
    
    // Move keeper randomly
    function moveKeeper() {
        const positions = ['left', 'center', 'right'];
        const randomIndex = Math.floor(Math.random() * positions.length);
        keeperPosition = positions[randomIndex];
        
        // Calculate new position
        let newPosition;
        switch (keeperPosition) {
            case 'left':
                newPosition = '30%';
                break;
            case 'right':
                newPosition = '70%';
                break;
            case 'center':
            default:
                newPosition = '50%';
        }
        
        // Animate keeper movement
        keeper.style.transition = `left ${levels[currentLevel].keeperSpeed}ms ease-out`;
        keeper.style.left = newPosition;
    }
    
    // Kick the ball
    function kickBall(side) {
        // Move keeper (but with a delay to make it fair)
        setTimeout(moveKeeper, levels[currentLevel].keeperSpeed / 2);
        
        // Animate ball
        let ballX, ballY;
        switch (side) {
            case 'left':
                ballX = '30%';
                break;
            case 'right':
                ballX = '70%';
                break;
            case 'center':
            default:
                ballX = '50%';
        }
        ballY = '-100px';
        
        ball.style.left = ballX;
        ball.style.bottom = ballY;
        
        // Determine if goal is scored after animation
        setTimeout(() => {
            const isGoal = determineGoal(side);
            showResult(isGoal, side);
        }, 500);
    }
    
    // Determine if the kick results in a goal
    function determineGoal(side) {
        // Random chance based on level difficulty
        const random = Math.random();
        if (random > levels[currentLevel].successRate) {
            return false; // Missed due to difficulty
        }
        
        // Check if keeper is in the same position
        return side !== keeperPosition;
    }
    
    // Show result of the kick
    function showResult(isGoal, side) {
        showScreen(resultScreen);
        
        if (isGoal) {
            resultTitle.textContent = "Vào Gôn!";
            resultMessage.textContent = `Bạn đã sút thành công về phía ${side}!`;
            successfulKicks++;
            updateProgress();
            
            // Check if level is completed
            if (successfulKicks >= 9) {
                nextKickBtn.classList.add('hidden');
                nextLevelBtn.classList.remove('hidden');
                resultMessage.textContent += " Bạn đã hoàn thành cấp độ này!";
            }
        } else {
            resultTitle.textContent = "Thủ Môn Bắt Được!";
            resultMessage.textContent = `Thủ môn đã chặn được cú sút về phía ${side}.`;
        }
    }
    
    // Show bonus screen
    function showBonus() {
        showScreen(bonusScreen);
        
        // Create confetti effect
        const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
        const container = document.querySelector('.confetti');
        container.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.top = '-10px';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animation = `confetti ${Math.random() * 3 + 2}s ease-in-out infinite`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(confetti);
        }
    }
    
    // Event listeners
    startBtn.addEventListener('click', () => {
        showScreen(gameScreen);
        moveKeeper();
    });
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const side = btn.getAttribute('data-side');
            kickBall(side);
        });
    });
    
    nextKickBtn.addEventListener('click', () => {
        // Reset ball position
        ball.style.left = '50%';
        ball.style.bottom = '100px';
        
        showScreen(gameScreen);
        moveKeeper();
    });
    
    nextLevelBtn.addEventListener('click', () => {
        if (currentLevel < 3) {
            currentLevel++;
            showBonus();
        } else {
            // Game completed
            nextLevelBtn.classList.add('hidden');
            restartBtn.classList.remove('hidden');
            showBonus();
        }
    });
    
    continueBtn.addEventListener('click', () => {
        initGame();
    });
    
    restartBtn.addEventListener('click', () => {
        currentLevel = 1;
        initGame();
    });
    
    // Start the game
    initGame();
});

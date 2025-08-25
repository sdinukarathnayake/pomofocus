document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const timeDisplay = document.querySelector('.time-display');
    const timerCircle = document.querySelector('.timer-circle');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pomodoroBtn = document.getElementById('pomodoro-btn');
    const shortBreakBtn = document.getElementById('short-break-btn');
    const longBreakBtn = document.getElementById('long-break-btn');

    // Settings elements
    const pomodoroLengthEl = document.getElementById('pomodoro-length');
    const shortBreakLengthEl = document.getElementById('short-break-length');
    const longBreakLengthEl = document.getElementById('long-break-length');

    // Timer variables
    let timer;
    let timeLeft;
    let isRunning = false;
    let currentMode = 'pomodoro';
    let pomodoroLength = 25;
    let shortBreakLength = 5;
    let longBreakLength = 15;

    // Initialize timer
    updateTimeDisplay();

    // Event Listeners
    startBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Mode buttons
    pomodoroBtn.addEventListener('click', () => switchMode('pomodoro'));
    shortBreakBtn.addEventListener('click', () => switchMode('short-break'));
    longBreakBtn.addEventListener('click', () => switchMode('long-break'));

    // Settings buttons
    document.getElementById('pomodoro-plus').addEventListener('click', () => changeDuration('pomodoro', 1));
    document.getElementById('pomodoro-minus').addEventListener('click', () => changeDuration('pomodoro', -1));
    document.getElementById('short-break-plus').addEventListener('click', () => changeDuration('short-break', 1));
    document.getElementById('short-break-minus').addEventListener('click', () => changeDuration('short-break', -1));
    document.getElementById('long-break-plus').addEventListener('click', () => changeDuration('long-break', 1));
    document.getElementById('long-break-minus').addEventListener('click', () => changeDuration('long-break', -1));

    // Functions
    function toggleTimer() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            startBtn.classList.remove('btn-primary');
            startBtn.classList.add('btn-secondary');

            timer = setInterval(() => {
                timeLeft--;
                updateTimeDisplay();

                // Update progress circle
                updateProgressCircle();

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    isRunning = false;
                    // Play completion sound (would be implemented with a sound file)
                    alert('Session complete! Time for a break.');

                    // Auto-switch to break after pomodoro
                    if (currentMode === 'pomodoro') {
                        switchMode('short-break');
                        startTimer();
                    } else {
                        switchMode('pomodoro');
                    }
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        startBtn.classList.remove('btn-secondary');
        startBtn.classList.add('btn-primary');
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        startBtn.classList.remove('btn-secondary');
        startBtn.classList.add('btn-primary');
        updateTimeDisplay();
        updateProgressCircle();
    }

    function switchMode(mode) {
        currentMode = mode;

        pomodoroBtn.classList.remove('active');
        shortBreakBtn.classList.remove('active');
        longBreakBtn.classList.remove('active');

        if (mode === 'pomodoro') {
            pomodoroBtn.classList.add('active');
            timeLeft = pomodoroLength * 60;
            timerCircle.style.background = 'conic-gradient(#4A90E2 0%, rgba(74, 144, 226, 0.2) 0%)';
        } else if (mode === 'short-break') {
            shortBreakBtn.classList.add('active');
            timeLeft = shortBreakLength * 60;
            timerCircle.style.background = 'conic-gradient(#87CEEB 0%, rgba(135, 206, 235, 0.2) 0%)';
        } else if (mode === 'long-break') {
            longBreakBtn.classList.add('active');
            timeLeft = longBreakLength * 60;
            timerCircle.style.background = 'conic-gradient(#B0E0E6 0%, rgba(176, 224, 230, 0.2) 0%)';
        }

        resetTimer();
    }

    function updateTimeDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateProgressCircle() {
        let totalTime;
        if (currentMode === 'pomodoro') {
            totalTime = pomodoroLength * 60;
        } else if (currentMode === 'short-break') {
            totalTime = shortBreakLength * 60;
        } else {
            totalTime = longBreakLength * 60;
        }

        const progress = ((totalTime - timeLeft) / totalTime) * 100;

        if (currentMode === 'pomodoro') {
            timerCircle.style.background = `conic-gradient(#4A90E2 ${progress}%, rgba(74, 144, 226, 0.2) ${progress}%)`;
        } else if (currentMode === 'short-break') {
            timerCircle.style.background = `conic-gradient(#87CEEB ${progress}%, rgba(135, 206, 235, 0.2) ${progress}%)`;
        } else {
            timerCircle.style.background = `conic-gradient(#B0E0E6 ${progress}%, rgba(176, 224, 230, 0.2) ${progress}%)`;
        }
    }

    function changeDuration(type, change) {
        if (type === 'pomodoro') {
            pomodoroLength = Math.max(1, Math.min(60, pomodoroLength + change));
            pomodoroLengthEl.textContent = pomodoroLength;
            if (currentMode === 'pomodoro') {
                timeLeft = pomodoroLength * 60;
                updateTimeDisplay();
                updateProgressCircle();
            }
        } else if (type === 'short-break') {
            shortBreakLength = Math.max(1, Math.min(30, shortBreakLength + change));
            shortBreakLengthEl.textContent = shortBreakLength;
            if (currentMode === 'short-break') {
                timeLeft = shortBreakLength * 60;
                updateTimeDisplay();
                updateProgressCircle();
            }
        } else if (type === 'long-break') {
            longBreakLength = Math.max(1, Math.min(60, longBreakLength + change));
            longBreakLengthEl.textContent = longBreakLength;
            if (currentMode === 'long-break') {
                timeLeft = longBreakLength * 60;
                updateTimeDisplay();
                updateProgressCircle();
            }
        }
    }

    function updateTimeDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Initialize
    switchMode('pomodoro');
});
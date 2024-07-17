const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const progressBar = document.getElementById('progress');
const resultsEl = document.getElementById('results');
const finalWpmEl = document.getElementById('final-wpm');
const finalAccuracyEl = document.getElementById('final-accuracy');
const finalTimeEl = document.getElementById('final-time');
const shareBtn = document.getElementById('share-btn');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');

let startTime, endTime, timeElapsed;
let isTyping = false;
let currentTextIndex = 0;
let mistakes = 0;
let timer;

// AI wrote most of the motivational quotes. Please let us know if you think there are motivational lyrics that might cause problems.

const sampleTexts = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "In the middle of difficulty lies opportunity.",
    "Believe you can and you're halfway there.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Success is not how high you have climbed, but how you make a positive difference to the world.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
    "The only way to achieve the impossible is to believe it is possible.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "It's going to be hard, but hard does not mean impossible.",
    "Don't wait for opportunity. Create it.",
    "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
    "The key to success is to focus on goals, not obstacles.",
    "Dream it. Believe it. Build it.",
    "Stay positive, work hard, make it happen.",
    "Good things come to those who hustle.",
    "Your dreams don't have an expiration date. Take a deep breath and try again.",
    "It always seems impossible until it's done.",
    "Don't watch the clock; do what it does. Keep going.",
    "Success is what happens after you have survived all of your disappointments.",
    "What seems to us as bitter trials are often blessings in disguise.",
    "The man who has confidence in himself gains the confidence of others.",
    "With the new day comes new strength and new thoughts.",
    "Your passion is waiting for your courage to catch up.",
    "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    "Pursue what catches your heart, not what catches your eyes.",
    "To be the best, you must be able to handle the worst.",
    "Don't limit your challenges. Challenge your limits.",
    "We may encounter many defeats but we must not be defeated.",
    "The struggle you're in today is developing the strength you need for tomorrow.",
    "Go the extra mile. It's never crowded.",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "Success is not in what you have, but who you are.",
    "You are stronger than you think.",
    "The best view comes after the hardest climb.",
    "Your life only gets better when you get better.",
    "Difficult roads often lead to beautiful destinations.",
    "The secret of getting ahead is getting started.",
    "Act as if what you do makes a difference. It does.",
    "Success usually comes to those who are too busy to be looking for it.",
    "Don’t be afraid to give up the good to go for the great.",
    "I find that the harder I work, the more luck I seem to have.",
    "Don’t let yesterday take up too much of today.",
    "Every small step forward is a step closer to your dreams.",
    "Embrace the journey, even the detours, for they shape your destiny.",
    "Your potential is limitless; push beyond your boundaries.",
    "Greatness begins with the decision to try.",
    "Chase your passions relentlessly; they are the keys to your success.",
    "Strength doesn't come from what you can do; it comes from overcoming the things you thought you couldn't.",
    "You are the artist of your own life. Don't hand the paintbrush to anyone else.",
    "Believe in the power of yet: you haven't succeeded yet.",
    "The biggest risk is not taking any risks at all.",
    "Your journey to a thousand miles begins with a single step.",
    "Transform your dreams into plans, and your plans into reality.",
    "Rise above the storm, and you will find the sunshine.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "The best investment you can make is in yourself.",
    "Turn your wounds into wisdom and your struggles into strengths.",
    "Stay focused, stay determined, and stay hopeful.",
    "Your mindset is the key to unlocking your potential.",
    "Keep moving forward; the best is yet to come.",
    "Create a life you can't wait to wake up to.",
    "Every day is a new chance to change your life.",
    "Your future is created by what you do today, not tomorrow.",
    "Dream boldly and dare to fail; success will follow.",
    "Harness the power of positivity to transform your world.",
    "Your attitude determines your direction.",
    "Let your faith be bigger than your fears.",
    "Your story is unique; make it worth telling.",
    "Stay patient and trust your journey.",
    "The only way to discover the limits of the possible is to go beyond them into the impossible.",
    "Find joy in the process, and success will come naturally.",
];

function startTest() {
    if (isTyping) return;

    resetTest();
    textDisplay.innerText = sampleTexts[currentTextIndex];
    inputField.disabled = false;
    inputField.focus();
    startBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
    isTyping = true;
    startTime = new Date().getTime();
    
    timer = setInterval(() => {
        if (!isTyping) {
            clearInterval(timer);
            return;
        }
        timeElapsed = Math.floor((new Date().getTime() - startTime) / 1000);
        timeEl.innerText = `${timeElapsed}s`;
        updateStats();
    }, 1000);
}

function resetTest() {
    clearInterval(timer);
    textDisplay.innerText = "Click 'Start' to begin the test.";
    inputField.value = '';
    inputField.disabled = true;
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    isTyping = false;
    timeEl.innerText = '0s';
    wpmEl.innerText = '0';
    accuracyEl.innerText = '0%';
    progressBar.style.width = '0%';
    resultsEl.style.display = 'none';
    mistakes = 0;
    currentTextIndex = Math.floor(Math.random() * sampleTexts.length);
}

function updateStats() {
    const typedWords = inputField.value.trim().split(/\s+/).length;
    const wpm = Math.round((typedWords / timeElapsed) * 60);
    wpmEl.innerText = wpm;

    const accuracy = calculateAccuracy(textDisplay.innerText, inputField.value);
    accuracyEl.innerText = `${accuracy}%`;

    const progress = (inputField.value.length / textDisplay.innerText.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function calculateAccuracy(original, typed) {
    const originalWords = original.trim().split(/\s+/);
    const typedWords = typed.trim().split(/\s+/);
    let correct = 0;

    typedWords.forEach((word, index) => {
        if (word === originalWords[index]) {
            correct++;
        }
    });

    return Math.round((correct / originalWords.length) * 100);
}

function finishTest() {
    isTyping = false;
    endTime = new Date().getTime();
    timeElapsed = Math.floor((endTime - startTime) / 1000);
    
    const finalWpm = Math.round((inputField.value.trim().split(/\s+/).length / timeElapsed) * 60);
    const finalAccuracy = calculateAccuracy(textDisplay.innerText, inputField.value);

    finalWpmEl.innerText = finalWpm;
    finalAccuracyEl.innerText = `${finalAccuracy}%`;
    finalTimeEl.innerText = timeElapsed;

    resultsEl.style.display = 'block';
    inputField.disabled = true;
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

startBtn.addEventListener('click', () => {
    if (isTyping) {
        finishTest();
    } else {
        startTest();
    }
});

resetBtn.addEventListener('click', resetTest);

inputField.addEventListener('input', () => {
    if (inputField.value.length === textDisplay.innerText.length) {
        finishTest();
    }
    updateStats();
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
});

shareBtn.addEventListener('click', () => {
    const text = `I just completed a typing test on UltraType! My speed: ${finalWpmEl.innerText} WPM, Accuracy: ${finalAccuracyEl.innerText}, Time: ${finalTimeEl.innerText}s`;
    if (navigator.share) {
        navigator.share({
            title: 'My UltraType Results',
            text: text,
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        prompt("Copy this text to share your results:", text);
    }
});

resetTest();
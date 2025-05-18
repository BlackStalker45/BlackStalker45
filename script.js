// Данные из data.json
const data = {
    "trash_symbols": ["!", "@", "#", "$", "%", "^", "&", "*", 
                    "(", ")", "-", "_", "=", "+", "[", "]", 
                    "{", "}", "|", "\\", ";", ":", "'", "\"", 
                    ",", "<", ".", ">", "/", "?", "`", "~"],
    "words_easy": ["ROCKET", "CHANGE", "WISDOM", "SILVER", 
                 "BUTTON", "YELLOW", "LAPTOP", "TRAVEL", 
                 "JACKET", "MELLOW", "PURPLE", "PLANET", 
                 "BANANA", "POCKET", "GUITAR", "KERNEL", 
                 "MATRIX", "SUDDEN", "ASPECT", "MIDDLE", 
                 "MELODY", "WISEST", "BUCKET", "HELMET", 
                 "MUSEUM", "SIMPLE", "HIDDEN", "BETTER", 
                 "WASHER", "DESERT", "CASTLE", "RABBIT", 
                 "PILLOW", "HUMBLE", "FELLOW", "MAGNET", 
                 "FOREST", "LINEAR", "SCARCE", "CRISIS",
				 "VORTEX", "BURNER", "FROSTY", "GRAVIT",
				 "WARPED", "PHAZON", "RADIAL", "GLOWER",
				 "SHIFER", "BLINKY", "CHIMER", "ZOMBIE",
				 "RIPPER", "GNAWER", "HOWLER", "STALKY",
				 "VINTAR", "RIFLER", "BULLET", "ARMORY",
				 "BANDIT", "ANOMAL", "FREEMA", "MONOLT",
				 "CLEARS", "MILITA", "ECOLAB", "SCAVVY",
				 "BARMEN", "ROSTOK", "PRIPYA", "YANTAR",
				 "REDFOR", "GARBAG", "SWAMPS", "LIMSKY",
				 "ARTIFA", "RADMAN", "BLEEDR", "STASHY",
				 "ANABIO", "MEDKIT", "FOODIE", "DRINKY",
				 "CAMPER", "PSYWAR", "GHOSTY", "DEATHS",
				 "SOULER", "SHADOW", "WHISPR", "ECHOES",
				 "VOICES", "DREAMY", "BLOWUP", "FLASHY",
				 "SMOKEY", "STORMY", "WOUNDR", "FEARER",
				 "RUNNER", "SEEKER", "TRAPPY", "DECAYD",
				 "WASTED", "FOGGED", "HEATER", "DARKEN",
				 "MOONED", "SUNNED"],
    "words_medium": ["ABSTRACT", "BALANCED", "CREATIVE", "DISCOVER", 
                  "ENERGIZE", "FLASHING", "GRATEFUL", "HALLUCIN", 
                  "INFINITE", "JUBILANT", "KEYWORDS", "LIBERATE", 
                  "MINDFUL", "NAVIGATE", "OPTIMIZE", "PARADISE", 
                  "QUESTIONS", "RESOURCE", "SCULPTOR", "TRANQUIL", 
                  "UNIVERSE", "VOYAGING", "WHISPERS", "ABSOLUTE", 
                  "BLUEPRINT", "CATALYST", "DIRECTLY", "EXERTION", 
                  "FOUNTAIN", "GRADIENT", "HIERARCHY", "INNOVATE", 
                  "JOURNEYING", "KNOWLEDGE", "LANGUAGES", "MONETARY", 
                  "NOURISH", "OVERFLOW", "PRESENCE", "QUARTILE", "RIVALRY"],
    "words_hard": ["ABSTINENCE", "BITTERSWEET", "COMPETITION", 
                 "DELIBERATE", "EFFICIENCY", "FREELANCER", "GENEROSITY", 
                 "HARMONIOUS", "IMPRESSIVE", "JUXTAPOSED", "KALEIDOSCOPE", 
                 "LUMINOSITY", "MEDITATION", "NEGOTIATOR", "OBLIGATIONS", 
                 "PERFECTION", "QUALIFIERS", "REVELATION", "SATISFACTION", 
                 "TRANSFORMED", "UNDERSTANDING", "VIBRATIONS", "WHIRLWIND", 
                 "XENOPHOBIA", "YEARNINGLY", "ZESTFULLY", "ACCELERATE", 
                 "BREATHTAKING", "CELEBRATION", "DETERMINATION", "EUPHORIC", 
                 "FLOURISHING", "GRATITUDE", "INNOVATION", "JUBILATION", 
                 "KINETICALLY", "LIMITLESSLY", "MAGNIFICENT", "NAVIGATING", "OPPORTUNITY"]
};

// Состояние игры
let lives = 3;
let selectedDifficulty = 6;
let final = [];
let answer = "";
let outlineWords = [];

// Элементы DOM
const difficultySelector = document.getElementById('difficulty-selector');
const mainContainer = document.getElementById('main-container');
const livesCount = document.getElementById('lives-count');
const livesVisual = document.getElementById('lives-visual');
const progressColumn = document.getElementById('progress-column');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');

// Адреса памяти
const memoryAddresses = [
    "0xF680", "0xF68C", "0xF698", "0xF634", "0xF64F", 
    "0xF6C7", "0xF680", "0xF670", "0xF6A7", "0xF689", 
    "0xF6DA", "0xF680", "0xF691", "0xF6A1", "0xF687", 
    "0xF6C6", "0xF6D3"
].join("\n");

// Выбор сложности
document.querySelectorAll('.difficulty-option').forEach(option => {
    option.addEventListener('click', () => {
        // Звук клика
        playSound('click');
        
        selectedDifficulty = parseInt(option.dataset.difficulty);
        const result = generate(selectedDifficulty);
        final = result.final;
        answer = result.answer;
        outlineWords = result.outlineWords;
        
        startGame();
    });
});

// Генерация слов
function generate(selected_dif) {
    let selected_words = [];
    let outline_words = [];
    
    switch(selected_dif) {
        case 6: selected_words = data.words_easy; break;
        case 8: selected_words = data.words_medium; break;
        case 10: selected_words = data.words_hard; break;
    }
    
    for (let i = 0; i < 6; i++) {
        outline_words.push(selected_words[Math.floor(Math.random() * selected_words.length)]);
    }
    
    let term_outline = '';
    for (let i = 0; i < 408; i++) {
        term_outline += data.trash_symbols[Math.floor(Math.random() * data.trash_symbols.length)];
    }
    
    let new_string = term_outline.split('');
    let indexes = [];
    for (let i = 0; i < 6; i++) {
        indexes.push(Math.floor(Math.random() * (408 - selected_dif)));
    }
    
    for (let i = 0; i < outline_words.length; i++) {
        const word = outline_words[i];
        const start_index = indexes[i];
        const end_index = start_index + word.length;
        new_string.splice(start_index, word.length, ...word.split(''));
    }
    
    const answer = outline_words[Math.floor(Math.random() * outline_words.length)].toUpperCase();
    const result = new_string.join('');
    
    const final = [];
    for (let i = 0; i < result.length; i += 12) {
        final.push(result.substr(i, 12).toUpperCase());
    }
    
    return { final, answer, outlineWords: outline_words.map(w => w.toUpperCase()) };
}

// Начало игры
function startGame() {
    difficultySelector.classList.add('hidden');
    mainContainer.classList.remove('hidden');
    
    document.getElementById('memory-column-1').textContent = memoryAddresses;
    document.getElementById('memory-column-2').textContent = memoryAddresses;
    
    const half = Math.ceil(final.length / 2);
    const column1 = final.slice(0, half).join("\n");
    const column2 = final.slice(half).join("\n");
    
    document.getElementById('words-column-1').textContent = column1;
    document.getElementById('words-column-2').textContent = column2;
    
    updateLivesDisplay();
    userInput.focus();
    
    // Звук запуска PDA
    playSound('start');
}

// Обновление отображения жизней
function updateLivesDisplay() {
    livesCount.textContent = lives;
    livesVisual.textContent = "[] ".repeat(lives).trim();
}

// Обработка ввода
submitBtn.addEventListener('click', handleSubmit);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
});

// Автоматический CAPS
userInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});

function handleSubmit() {
    const userTry = userInput.value.trim().toUpperCase();
    if (!userTry) return;
    
    userInput.value = '';
    playSound('keypress');
    
    if (userTry === answer) {
        progressColumn.textContent += `${userTry}\n>ВХОД В СИСТЕМУ\n`;
        playSound('success');
        setTimeout(() => {
            alert("ДОСТУП РАЗРЕШЕН! ИГРА ЗАВЕРШЕНА.");
            resetGame();
        }, 1000);
    } else if (outlineWords.includes(userTry)) {
        lives--;
        updateLivesDisplay();
        playSound('error');
        
        let correct = 0;
        for (let i = 0; i < answer.length; i++) {
            if (answer[i] === userTry[i]) correct++;
        }
        
        progressColumn.textContent += `${userTry}\n>ОТКАЗ В ДОСТУПЕ\n${correct}/${answer.length} ПРАВИЛЬНО\n`;
        
        if (lives <= 0) {
            setTimeout(() => {
                playSound('fail');
                alert("ПОПЫТКИ ИСЧЕРПАНЫ! ДОСТУП ЗАПРЕЩЕН.");
                resetGame();
            }, 1000);
        }
    } else {
        progressColumn.textContent += `${userTry}\n>ОШИБКА\n`;
        playSound('error');
    }
}

// Сброс игры
function resetGame() {
    lives = 3;
    progressColumn.textContent = "";
    difficultySelector.style.opacity = 0;
    difficultySelector.classList.remove('hidden');
    mainContainer.classList.add('hidden');
    
    let opacity = 0;
    const fadeIn = setInterval(() => {
        opacity += 0.05;
        difficultySelector.style.opacity = opacity;
        if (opacity >= 1) clearInterval(fadeIn);
    }, 30);
}

// Простые звуковые эффекты
function playSound(type) {
    const sounds = {
        click: { freq: 800, duration: 0.1 },
        keypress: { freq: 500, duration: 0.05 },
        error: { freq: 300, duration: 0.3 },
        success: { freq: 1000, duration: 0.5 },
        fail: { freq: 200, duration: 1 },
        start: { freq: 1200, duration: 0.2 }
    };
    
    if (sounds[type]) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.value = sounds[type].freq;
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + sounds[type].duration);
        oscillator.stop(audioCtx.currentTime + sounds[type].duration);
    }
}
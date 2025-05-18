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
                  "NOURISH", "OVERFLOW", "PRESENCE", "QUARTILE", 
				  "RIVALRY","VORTEXER", "GRAVITON", "BLOODSUK", 
				  "MERCENAR", "MONOLITH", "RENEGADE", "CLEARSKY", 
				  "MILITARY", "STALKERS", "GAUSSRIF", "VINTOREZ", 
				  "ARTIFACT", "DETECTOR", "SILENCER", "YANTARNY", 
				  "DARKSONE", "CNPPZONE", "RADSTORM", "EMISSION", 
				  "STASHBOX", "WISHGRAN", "DEADSOUL", "STALKING", 
				  "RUSTLAND", "ZONERULE", "ARTIFACT", "SECRETST", 
				  "GALACTIC", "MOLECULE", "OBSIDIAN", "SOFTWARE",
				  "HARDWARE", "ROBOTICS", "NANOTECH", "KEYBOARD", 
				  "LASERDOT", "HOLOGRAM", "EUPHORIA", "SERENITY", 
				  "PARANOIA", "BLISSFUL", "TOKYOITE", "PARISIAN", 
				  "TROPICAL", "ATLANTIC", "HIGHLAND", "WIZARDRY", 
				  "WEREWOLF", "ELVENBOW", "MYSTICAL", "CHOCOLAT", 
				  "ESPRESSO", "MACARONI", "CINNAMON", "MARGARIT", 
				  "BARBECUE", "SYMPHONY", "BALLROOM", "CALLIGRA", 
				  "GRAFFITI", "BASKETRY", "FOOTBALL", "YOGALIFE", 
				  "SKATEPAD", "MARATHON", "ENGINEER", "DESIGNER", 
				  "CURIOSIT", "ILLUSION", "INFINITY", "VELOCITY", 
				  "ETERNITY"],
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
        playSound('click');
        
        selectedDifficulty = parseInt(option.dataset.difficulty);
        
        // Устанавливаем количество слов в зависимости от сложности
        let countWords;
        switch(selectedDifficulty) {
            case 6:  // Легкая
                countWords = 6;  // Меньше слов
                break;
            case 8:  // Средняя
                countWords = 8;  // Стандартное количество
                break;
            case 10: // Сложная
                countWords = 10;  // Больше слов
                break;
            default:
                countWords = 6;
        }
        
        const result = generate(selectedDifficulty, countWords);
        final = result.final;
        answer = result.answer;
        outlineWords = result.outlineWords;
        
        startGame();
    });
});

// Генерация слов с разделителями
function generate(selected_dif, countWords) {
    let selected_words = [];
    let outline_words = [];
    
    switch(selected_dif) {
        case 6: selected_words = data.words_easy; break;
        case 8: selected_words = data.words_medium; break;
        case 10: selected_words = data.words_hard; break;
    }
    
    // Выбираем уникальные слова
    const shuffled = [...selected_words].sort(() => 0.5 - Math.random());
    outline_words = shuffled.slice(0, countWords);
    
    // Параметры генерации в зависимости от сложности
    const difficultyParams = {
        6: { minGap: 30, maxGap: 90 },   // Легкая - больше пробелов
        8: { minGap: 20, maxGap: 70 },   // Средняя
        10: { minGap: 10, maxGap: 50 }   // Сложная - слова ближе друг к другу
    };
    
    const { minGap, maxGap } = difficultyParams[selected_dif] || { minGap: 3, maxGap: 6 };
    
    let term_outline = '';
    const separators = data.trash_symbols;
    let currentLength = 0;
    
    // Генерируем слова с разделителями
    outline_words.forEach((word, index) => {
        // Добавляем разделители перед словом (кроме первого)
        if (index > 0) {
            const gap = minGap + Math.floor(Math.random() * (maxGap - minGap + 1));
            for (let i = 0; i < gap; i++) {
                term_outline += separators[Math.floor(Math.random() * separators.length)];
                currentLength++;
            }
        }
        
        // Добавляем само слово
        term_outline += word;
        currentLength += word.length;
    });
    
    // Заполняем оставшееся пространство случайными символами
    while (currentLength < 408) {
        term_outline += separators[Math.floor(Math.random() * separators.length)];
        currentLength++;
    }
    
    // Обрезаем лишнее
    term_outline = term_outline.substring(0, 408);
    
    // Выбираем ответ
    const answer = outline_words[Math.floor(Math.random() * outline_words.length)].toUpperCase();
    
    // Разбиваем на строки по 12 символов
    const final = [];
    for (let i = 0; i < term_outline.length; i += 12) {
        final.push(term_outline.substr(i, 12).toUpperCase());
    }
    
    return { 
        final, 
        answer, 
        outlineWords: outline_words.map(w => w.toUpperCase()) 
    };
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
        // Функция для конвертации в московское время (MSK, UTC+3)
        const getMoscowTime = () => {
            const now = new Date();
            // Получаем текущее смещение UTC (в минутах)
            const localOffset = now.getTimezoneOffset() * 60000;
            // Московское время = UTC+3
            const moscowOffset = 3 * 3600000;
            // Создаем новую дату с московским временем
            const moscowTime = new Date(now.getTime() + localOffset + moscowOffset);
            
            // Форматируем компоненты даты
            const day = String(moscowTime.getDate()).padStart(2, '0');
            const month = String(moscowTime.getMonth() + 1).padStart(2, '0');
            const year = moscowTime.getFullYear();
            const hours = String(moscowTime.getHours()).padStart(2, '0');
            const minutes = String(moscowTime.getMinutes()).padStart(2, '0');
            
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        };

        const moscowDateTime = getMoscowTime();
        
        alert(`=== ДОСТУП РАЗРЕШЕН ===\n\n> СТАТУС: ДОСТУП ПОЛУЧЕН\n> ВРЕМЯ ВЫПОЛНЕНИЯ: ${moscowDateTime}\n\n> ПРОТОКОЛ ЗАКРЫТ`);
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
				// Функция для конвертации в московское время (MSK, UTC+3)
        const getMoscowTime = () => {
            const now = new Date();
            // Получаем текущее смещение UTC (в минутах)
            const localOffset = now.getTimezoneOffset() * 60000;
            // Московское время = UTC+3
            const moscowOffset = 3 * 3600000;
            // Создаем новую дату с московским временем
            const moscowTime = new Date(now.getTime() + localOffset + moscowOffset);
            
            // Форматируем компоненты даты
            const day = String(moscowTime.getDate()).padStart(2, '0');
            const month = String(moscowTime.getMonth() + 1).padStart(2, '0');
            const year = moscowTime.getFullYear();
            const hours = String(moscowTime.getHours()).padStart(2, '0');
            const minutes = String(moscowTime.getMinutes()).padStart(2, '0');
            
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        };

        const moscowDateTime = getMoscowTime();

                alert(`=== ДОСТУП ЗАПРЕЩЕН ===\n\n> СТАТУС: В ДОСТУПЕ ОТКАЗАНО\n> ВРЕМЯ ВЫПОЛЕНИЯ: ${moscowDateTime}\n\n> ПРОТОКОЛ ЗАКРЫТ`);
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
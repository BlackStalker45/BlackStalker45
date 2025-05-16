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
                 "FOREST", "LINEAR", "SCARCE", "CRISIS"],
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

// Game state
let lives = 3;
let selectedDifficulty = 6;
let final = [];
let answer = "";
var outlineWords = [];

// DOM elements
const difficultySelector = document.getElementById('difficulty-selector');
const mainContainer = document.getElementById('main-container');
const livesCount = document.getElementById('lives-count');
const livesVisual = document.getElementById('lives-visual');
const progressColumn = document.getElementById('progress-column');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');

// Memory addresses
const memoryAddresses = [
    "0xF680", "0xF68C", "0xF698", "0xF634", "0xF64F", 
    "0xF6C7", "0xF680", "0xF670", "0xF6A7", "0xF689", 
    "0xF6DA", "0xF680", "0xF691", "0xF6A1", "0xF687", 
    "0xF6C6", "0xF6D3"
].join("\n");

// Set up difficulty selection
document.querySelectorAll('.difficulty-option').forEach(option => {
    option.addEventListener('click', () => {
        selectedDifficulty = parseInt(option.dataset.difficulty);
        // Generate words based on difficulty
        const result = generate(selectedDifficulty);
        final = result.final;
        answer = result.answer;
        outlineWords = result.outlineWords;
		
		console.log(final, answer, outlineWords);
		
		outlineWords.forEach(el => {
			let correct = 0;
			for (let i = 0; i < answer.length; i++) {
				if (answer[i] === el[i]) {
					correct++;
				}
			}
			
			console.log(el, el.length, "=", correct);
		});
		
        startGame();
    });
});

// Функция генерации, аналогичная loader.py
function generate(selected_dif) {
    let selected_words = [];
    let outline_words = [];
    
    // Выбираем слова в зависимости от сложности
    switch(selected_dif) {
        case 6:
            selected_words = data.words_easy;
            break;
        case 8:
            selected_words = data.words_medium;
            break;
        case 10:
            selected_words = data.words_hard;
            break;
    }
    
    // Выбираем 6 случайных слов
    for (let i = 0; i < 6; i++) {
        outline_words.push(selected_words[Math.floor(Math.random() * selected_words.length)]);
    }
    
    // Создаём строку из случайных символов
    let term_outline = '';
    for (let i = 0; i < 408; i++) {
        term_outline += data.trash_symbols[Math.floor(Math.random() * data.trash_symbols.length)];
    }
    
    // Вставляем слова в случайные позиции
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
    
    // Выбираем правильный ответ
    const answer = outline_words[Math.floor(Math.random() * outline_words.length)].toUpperCase();
    const result = new_string.join('');
    
    // Разбиваем на строки по 12 символов
    let final = [];
    for (let i = 0; i < result.length; i += 12) {
        final.push(result.substr(i, 12));
    }	
	final = final.map(el => el.toUpperCase())
	
    return { final, answer, outlineWords: outline_words };
}

// Start the game with selected difficulty
function startGame() {
    difficultySelector.classList.add('hidden');
    mainContainer.classList.remove('hidden');
    
    // Set up memory columns
    document.getElementById('memory-column-1').textContent = memoryAddresses;
    document.getElementById('memory-column-2').textContent = memoryAddresses;
    
    // Display words in two columns
    const half = Math.ceil(final.length / 2);
    const column1 = final.slice(0, half).join("\n");
    const column2 = final.slice(half).join("\n");
    
    document.getElementById('words-column-1').textContent = column1;
    document.getElementById('words-column-2').textContent = column2;
    
    // Set up lives display
    updateLivesDisplay();
    
    // Focus input
    userInput.focus();
}

// Update lives display
function updateLivesDisplay() {
    livesCount.textContent = lives;
    livesVisual.textContent = "[] ".repeat(lives).trim();
}

// Handle submit
submitBtn.addEventListener('click', handleSubmit);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSubmit();
    }
});

function handleSubmit() {
    const userTry = userInput.value.trim() ;
	console.log(outlineWords);
    userInput.value = '';
    
    if (userTry === answer) {
        progressColumn.textContent += `${userTry}\n>Вход в систему\n`;
        setTimeout(() => {
            alert("Доступ разрешен! Игра завершена.");
            resetGame();
        }, 500);
    } else if (outlineWords.includes(userTry)) {
        lives--;
        updateLivesDisplay();
        
        // Calculate correct characters
        let correct = 0;
        for (let i = 0; i < answer.length; i++) {
            if (answer[i] === userTry[i]) {
                correct++;
            }
        }
        
        progressColumn.textContent += `${userTry}\n>Отказ в доступе\n${correct}/${answer.length} правильно\n`;
        
        if (lives <= 0) {
            setTimeout(() => {
                alert("Попытки исчерпаны! Доступ запрещен.");
                resetGame();
            }, 500);
        }
    } else {
        progressColumn.textContent += `${userTry}\n>Ошибка\n`;
    }
}

// Reset the game
function resetGame() {
    lives = 3;
    progressColumn.textContent = "";
    difficultySelector.classList.remove('hidden');
    mainContainer.classList.add('hidden');
}

userInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});
var movies = [
    "Форрест Гамп","Властелин колец","Список Шиндлера","Зеленая миля","Матрица","Крестный отец","Темный рыцарь","Гладиатор","Аватар","Назад в будущее","Терминатор","Леон","День сурка"

];

const youWon = "You Won!";
const youLost = "You Lost!";

// Функция Game создает игровой объект
function Game () {
    let word = movies[Math.floor(Math.random() * movies.length)]
    word = word.toUpperCase()
    let guessedLetters = []
    let incorrectGuesses = 0
    let possibleGuesses = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
    let maxGuesses = 7
    let maskedWord = ''
    let won = false
    let lost = false

    // Цикл for для отрисовки замаскированного слова
    for(let i = 0; i < word.length; i++)
    {
        let space = ' '
        let nextCharacter = word.charAt(i) === space ? space : '_'
        maskedWord += nextCharacter

    }
    // Проверка слова верно/не верно. Далее победа или продолжение
    let guessWord = function (guessedWord){
        guessedWord = guessedWord.toUpperCase()
        if(guessedWord === word){
            guessAllLetters()
        }
        else {
            handleIncorrectGuess()
        }
    }

    // Отрисовка слова если угадано
    let guessAllLetters = function (){
        for(let i = 0; i < word.length; i++) {
            guess(word.charAt(i))
        }
    }

    // Проверка буквы угадал/не угадал
    let guess = function(letter){
        letter = letter.toUpperCase()
        if (!guessedLetters.includes(letter)) {
            guessedLetters.push(letter)
            possibleGuesses = possibleGuesses.replace(letter, '')
            if (word.includes(letter)) {

                let matchingIndexes = []

                for (let i = 0; i < word.length; i++) {
                    word.charAt(i) === letter && matchingIndexes.push(i)             
                }

                matchingIndexes.forEach((index)=>{
                    maskedWord = replace(maskedWord, index, letter)
                })
                if(!lost){
                    won = maskedWord === word
                }
                // console.log('Какие индексы совпали', matchingIndexes)
            }
            else {
                handleIncorrectGuess()
            }

        } 
    }

    // Заменяет символ в строке по индексу
    function replace(value, index, replacement){
        return value.substr(0,index) + replacement + value.substr(index + replacement.length)
     }

    // Счетчик отсавшихся попыток
    let handleIncorrectGuess = function() {
        incorrectGuesses++
        lost = incorrectGuesses >= maxGuesses
        if(lost){
            guessAllLetters()
        }

    }


    return {
        'getMaskedWord': function() {return maskedWord},
        'guess': guess,
        'getPossibleGuesses': function(){return [...possibleGuesses]},
        'getIncorrectGuesses': function(){return incorrectGuesses},
        'guessWord': guessWord,
        'isWon': function() {return won},
        'isLost': function() {return lost}
    }
}

// Обработка ввода игрока
function listenForInput (game){
    let guessLetter = function (letter){
        if (letter){
            let gameStillGoing = !game.isWon() && !game.isLost()
            if(gameStillGoing){
                game.guess(letter)
                render(game)
            }
        }
    }

    let handleClick = function(event){
        if(event.target.classList.contains('guess')){
            guessLetter(event.target.innerHTML)
        }
    }

    let handKeyPress = function(event){
        let letter = null
        const Ф = 65
        const Э = 222
        const ENTER = 13
        let isLetter = event.keyCode >= Ф && event.keyCode <=Э
        let guessWordButton = document.getElementById('guessWordButton')
        let newGameButton = document.getElementById('newGameButton')
        let guessBox = document.getElementById('guessBox')
        let gameOver = guessBox.value === youWon || guessBox.value === youLost

        if(event.target.id !== 'guessBox' && isLetter){
            letter = String.fromCharCode(event.keyCode)
        }
        else if (event.keyCode ===  ENTER && gameOver){
            newGameButton.click()
        }
        else if (event.keyCode === ENTER && guessBox.value !== '')
        guessWordButton.click()
        
    }



    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handKeyPress)
}


// Функция render рендерит графику
function render(game){
    document.getElementById('word').innerHTML = game.getMaskedWord()
    document.getElementById('guesses').innerHTML = ''
    game.getPossibleGuesses().forEach( function(guess) {
		let innerHtml = "<span class='guess'>" + guess + "</span>";
        document.getElementById('guesses').innerHTML += innerHtml
	});
    document.getElementById('hangmanImage').src = 'img/hangman' +
                                                    game.getIncorrectGuesses() +
                                                    '.png'

    let guessBox = document.getElementById('guessBox')

    if(game.isWon()){
        guessBox.value  = youWon
        guessBox.classList = 'win'
    }
    else if (game.isLost()){
        guessBox.value = youLost
        guessBox.classList = 'lost'
    }
    else {
        guessBox.value = ''
        guessBox.classList = ''
    }
}

// Отправка слова из инпута в футкию game
function guessWord( game) {
    let gameStillGoing = !game.isWon() && !game.isLost()
    let guessWord = document.getElementById('guessBox').value
    if(gameStillGoing){
        game.guessWord(guessWord)
        render(game)
    }
}

// Функция начала новой игры
function newGame(){
    history.go(0)
}

let game = new Game()
render(game)
listenForInput(game)

// const check = (game, letter) =>{
    // game.guess(letter)
    // render(game)
// }




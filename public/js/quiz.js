//Co to za emocja

const questions = [
    {
        image: "/images/obrzydzenie-dziecko(1).jpg",
        correct_option: "Obrzydzenie",
    },
    {
        image: "/images/radosc-dziecko v3.jpg",
        correct_option: "Radość",
    },
    {
        image: "/images/smutek-dziecko.jpg",
        correct_option: "Smutek",
    },
    {
        image: "/images/zlosc-dziecko.jpg",
        correct_option: "Złość",
    },
    {
        image: "/images/zaskoczenie-dziecko.jpg",
        correct_option: "Zaskoczenie",
    },
    {
        image: "/images/strach-dziecko v2.jpg",
        correct_option: "Strach",
    },
];

const optionsArray = [
    "Złość",
    "Obrzydzenie",
    "Radość",
    "Smutek",
    "Zaskoczenie",
    "Strach",
    "Wstyd",
    "Duma",
    "Zażenowanie ",
];
const container = document.querySelector(".whats-container");
const gameContainer = document.querySelector(".game-container");
const startButton = document.getElementById("start");
const scoreContainer = document.querySelector(".score-container");
const userScore = document.getElementById("user-score");
let timer = document.getElementsByClassName("timer")[0];
let nextBtn;
let score, currentQuestion, finalQuestions;
let countdown,
    count = 11;

const randomValueGenerator = (array) =>
    array[Math.floor(Math.random() * array.length)];

const randomShuffle = (array) => array.sort(() => 0.5 - Math.random());

const startGame = () => {

    scoreContainer.classList.add("hide");
    gameContainer.classList.remove("hide");
    finalQuestions = populateQuestions();
    score = 0;
    currentQuestion = 0;

    cardGenerator(finalQuestions[currentQuestion]);
};

const timerDisplay = () => {
    countdown = setInterval(() => {
        count -= 1;
        timer.innerHTML = `<span>Czas: </span>${count}s`;
        if (count == 0) {
            clearInterval(countdown);
            nextQuestion();
        }
    }, 1000);
};

const populateOptions = (correct_option) => {
    let arr = [];
    arr.push(correct_option);
    let optionsCount = 1;
    while (optionsCount < 4) {
        let randomvalue = randomValueGenerator(optionsArray);
        if (!arr.includes(randomvalue)) {
            arr.push(randomvalue);
            optionsCount += 1;
        }
    }
    return arr;
};

const populateQuestions = () => {
    let questionsCount = 0;
    let chosenObjects = [];
    let questionsBatch = [];

    while (questionsCount < 5) {
        let randomvalue = randomValueGenerator(questions);
        let index = questions.indexOf(randomvalue);
        if (!chosenObjects.includes(index)) {
            questionsBatch.push(randomvalue);
            chosenObjects.push(index);
            questionsCount += 1;
        }
    }
    return questionsBatch;
};

const checker = (e) => {
    let userSolution = e.target.innerText;
    let options = document.querySelectorAll(".option");
    if (userSolution === finalQuestions[currentQuestion].correct_option) {
        e.target.classList.add("correct");
        score++;
    } else {
        e.target.classList.add("incorrect");
        options.forEach((element) => {
            if (element.innerText == finalQuestions[currentQuestion].correct_option) {
                element.classList.add("correct");
            }
        });
    }
    clearInterval(countdown);

    options.forEach((element) => {
        element.disabled = true;
    });
};

const nextQuestion = (e) => {

    currentQuestion += 1;
    if (currentQuestion == finalQuestions.length) {
        gameContainer.classList.add("hide");
        scoreContainer.classList.remove("hide");
        startButton.innerText = `Restart`;
        userScore.innerHTML =
            "Twój wynik " + score + " z " + currentQuestion;
        clearInterval(countdown);
    } else {
        cardGenerator(finalQuestions[currentQuestion]);
    }
};

const cardGenerator = (cardObject) => {
    const { image, correct_option } = cardObject;
    let options = randomShuffle(populateOptions(correct_option));
    container.innerHTML = `<div class="quiz">
    <p class="num">
    ${currentQuestion + 1}/5
    </p>
    <div class="questions">
      <img class="emotion-image" src="${image}" width="250" height="366"/>
    </div>
      <div class="options">
      <button class="option" onclick="checker(event)">${options[0]}
      </button>
      <button class="option" onclick="checker(event)">${options[1]}
      </button>
      <button class="option" onclick="checker(event)">${options[2]}
      </button>
      <button class="option" onclick="checker(event)">${options[3]}
      </button>
      </div>
      <div class="nxt-btn-div">
          <button class="next-btn" onclick="nextQuestion(event)">Następne</button>
      </div>
    </div>`;

    count = 11;
    clearInterval(countdown);

    timerDisplay();
};
startButton.addEventListener("click", startGame);
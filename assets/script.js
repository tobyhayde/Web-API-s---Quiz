$(document).ready(function (){
    var appStates = {
        Initial : "state.initial",
        Questioning : "state.questioning",
        SubmittingScore : "state.submittingscore",
        Leaderboard : "state.leaderboard"
    };

    var contElement = $("#content");
    var timrElement = $("#timer");
    var hgscElement = $("#highscores");
    var currState;
    var prevState;
    var score = 0;
    var secondsElapsed = 0;
    var interval;

    var currQuestion = 0;
    var lastSelectedAnswer = "";

    const quizTime = 75;
    const questions = [
        question_1 = {
            textContent: "Who is NOT in the top 5 scorers for Liverpool? (all competitions)",
            options : [
               "Gerrard",
               "Rush",
               "Crouch",
               "Hodgson"
            ],
            answer : "Crouch"
        },

        question_2 = {
            textContent: "Who has the MOST caps for Liverpool?",
            options : [
               "Callaghan",
               "Carragher",
               "Gerrard",
               "Rush"
            ],
            answer : "Callaghan"
        },

        question_3 = {
            textContent: "How many European cups have Liverpool won?",
            options : [
                "3",
                "4",
                "5",
                "6"
            ],
            answer : "6"
        },
            
        question_4 = {
            textContent: "Who holds the Liverpool record for the most goals in a single premier league season?",
            options : [
                "Suarez",
                "Salah",
                "Torres",
                "Owen"
            ],
            answer : "Salah"
        },

        question_5 = {
            textContent: "Who is Liverpool's record signing?",
            options : [
                "Van Dijk",
                "Keita",
                "Alisson",
                "Suarez"
            ],
            answer : "Van Dijk"
        }    
    ];

    init();

    function init(){
        $(timrElement).html(`Timer: ${getFormattedSeconds()}`);
        $(hgscElement).html("View Highscores");
        reset();
        createInitialPage();

        $(hgscElement).on("click", function(){
            clearInterval(interval);
            createLeaderboard();
        });
    }

    function reset() {
        secondsElapsed = 0;
        currQuestion = 0;
    }

    function startTimer() {
        clearInterval(interval);

        interval = setInterval(function() {
            secondsElapsed++;
            $(timrElement).html(`Timer: ${getFormattedSeconds()}`);

            if (secondsElapsed >= quizTime) {
                clearInterval(interval);
                if (secondsElapsed > quizTime) 
                    secondsElapsed = quizTime;
                createSubmitPage();
            }
        }, 1000);
    }

    function getFormattedSeconds() {
        return (quizTime - secondsElapsed);
    }

    function createInitialPage() {
        currState = appStates.Initial;
        console.log("App State Transitioning To:", currState);

        $(contElement).empty();
        
        var header = $("<header><h1>Liverpool FC Quiz</h1></header>");
        var paragraph = $("<p>Good luck! Keep in mind that incorrect answers will penalize your score and time.</p>")
        var button = $("<button id=\"start-quiz-btn\" type=\"button\" class=\"btn btn-red\">Start Quiz!</button>")

        $(contElement).append(header, paragraph, button);

        $("#start-quiz-btn").on("click", function() {
            createNewQuestion();
        });
    }

    function createNewQuestion() {
        if(currQuestion >= questions.length) {
            createSubmitPage();
            return;
        }

        prevState = currState;
        currState = appStates.Questioning;
        console.log("App State Transitioning To:", currStatezam);

        $(contElement).empty();

        var questionObj = questions[currQuestion];
        var header = $(`<h1>${questionObj.textContent}</h1>`);
        var unList = $("<ul>");

        $(questionObj.options).each(function(index, value){
            var btn = $(`<li><button type="button" class="ques-option btn btn-red" data-ques-option="${value}">${index + 1}. ${value}</button></li>`);
            $(unList).append(btn);
        });

        $(contElement).append(header, unList);

        if(prevState != appStates.Questioning)
            startTimer();

        $(".ques-option").on("click", function(event){
            event.preventDefault();
            lastSelectedAnswer = $(this).attr("data-ques-option");
            var isCorrect = lastSelectedAnswer === questionObj.answer;

            if (isCorrect)
                score += 30;
            else if (!isCorrect) {
                secondsElapsed += 10;
            }

            currQuestion++;
            createNewQuestion();

            if (isCorrect)
                displayMessage("Correct!");
            else 
                displayMessage("Wrong!");
        });

    
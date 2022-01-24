// initial declarations and questions array
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

    const quizTime = 60;
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

// initial home page along with timer function  
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
        var button = $("<button id='start-quiz-btn' type='button' class='btn btn-red'>Start Quiz!</button>")

        $(contElement).append(header, paragraph, button);

        $("#start-quiz-btn").on("click", function() {
            createNewQuestion();
        });
    }
// cycle through each question with correct/wrong response
    function createNewQuestion() {
        if(currQuestion >= questions.length) {
            createSubmitPage();
            return;
        }

        prevState = currState;
        currState = appStates.Questioning;
        console.log("App State Transitioning To:", currState);

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
                score += 50;
            else if (!isCorrect) {
                secondsElapsed += 5;
            }

            currQuestion++;
            createNewQuestion();

            if (isCorrect)
                displayMessage("Correct!");
            else 
                displayMessage("Wrong!");
        });
    }

// quiz end score submit page and save to local storage 
    function createSubmitPage() {
        clearInterval(interval);
        $(timrElement).html(`Timer: ${getFormattedSeconds()}`);
        currState = appStates.SubmittingScore;
        console.log("App State Transitioning To:", currState);
    
        var totalScore = score + (Math.floor(getFormattedSeconds() * .15));
    
        $(contElement).empty();
    
        var header = $("<h1>Finished!</h1>");
        var paragraph = $(`<p style="text-align: left">Your score is ${totalScore}.</p>`);
        var submitField = $("<div class='submit-field'>Enter initials: <input id='initials' type='text'> <button id='initials-submit' type='button' class='btn btn-red'>Submit</button></div>");
    
        $(contElement).append(header, paragraph, submitField);
    
        $("#initials-submit").on("click", function(event){
            event.preventDefault();
 
            currState = appStates.Initial;
    
            var inputInitials = $("#initials").val();
    
            if(!inputInitials){
                alert("You must provide initials to save your score!");
                return;
            }
    
            var highscores = localStorage.getItem("highscores");
    
            if(!highscores)
                highscores = {};
            else
                highscores = JSON.parse(highscores);
    
            highscores[inputInitials] = totalScore;
    
            localStorage.setItem("highscores", JSON.stringify(highscores));
    
            createLeaderboard();
            reset();
        });
    }
// highscores saved and colour-coded with sortfunction
    function createLeaderboard() {
        if(currState != appStates.Leaderboard)
            prevState = currState;
            currState = appStates.Leaderboard;
        console.log("App State Transitioning To:", currState);

        $(hgscElement).empty();
        $(timrElement).empty();
        $(contElement).empty();

        var header = $("<h1 style='margin-top:0;'>Highscores!</h1>");

        var highscores = localStorage.getItem("highscores");

        $(contElement).append(header);

        if(highscores)
        {
            var parsedHighscores = JSON.parse(highscores);

            var sortedHighscores = sortHighscores();

            var orderScores = $("<ol id='highscore-list'></ol>");

            var counter = 1;
            $.each(sortedHighscores, function(key, value)
            {
                var liElement = $(`<li class="highscore">${counter}. ${key} - ${value}</li>`);

                if (counter % 2)
                    liElement.addClass("yellow");
                else
                    liElement.addClass("blue");

                $(orderScores).append(liElement);
                counter++;
            });

            $(contElement).append(orderScores);

            function sortHighscores() {
                items = Object.keys(parsedHighscores).map(function(key) {
                    return [key, parsedHighscores[key]];
                });
                items.sort(function(first, second) {
                    return second[1] - first[1];
                });
                sorted_obj={}
                $.each(items, function(k, v) {
                    use_key = v[0]
                    use_value = v[1]
                    sorted_obj[use_key] = use_value
                });
                return(sorted_obj);
            } 
        }

        var buttons = $("<div style='text-align:left'><button id='hs-back' type='button' class='btn btn-red'>Go Back</button> <button id='hs-clear' type='button' class='btn btn-red'>Clear Highscores</button></div>");

        $(contElement).append(buttons);

        $("#hs-clear").on("click", function(event) {
            event.preventDefault();
            localStorage.removeItem("highscores");
            $("#highscore-list").empty();
        });

        $("#hs-back").on("click", function(event){
            event.preventDefault();

            switch(prevState)
            {
                case appStates.Initial:
                    createInitialPage();
                    break;
                case appStates.Questioning:
                    createNewQuestion();
                    break; 
                case appStates.SubmittingScore:
                    createSubmitPage();
                    break;
                default:
                    console.log(`state ${prevState} not supported`);
                    break;
            }

            $(timrElement).html(`Timer: ${getFormattedSeconds()}`);
            $(hgscElement).html("View Highscores");
    });
    }
});
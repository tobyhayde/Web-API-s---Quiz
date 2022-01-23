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
            

        question_4 = {
            

        question_5 = {
          
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

    
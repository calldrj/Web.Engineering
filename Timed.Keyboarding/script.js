const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
/* Create a test list of texts */
const testList = [ "Once upon a time, there was a little girl named Goldilocks.",
                   "She went for a walk in the forest. Pretty soon, she came upon a house.",
                   "She knocked and, when no one answered, she walked right in.",
                   "At the table in the kitchen, there were three bowls of porridge.",
                   "Goldilocks was hungry. She tasted the porridge from the first bowl.",
                   "'This porridge is too hot!' she exclaimed.",
                   "'This porridge is too cold,' she said",
                   "So, she tasted the last bowl of porridge.",
                   "'Ahhh, this porridge is just right,' she said happily and she ate it all up.",
                   "After she'd eaten the three bears' breakfasts she decided she was feeling a little tired.",
                   "So, she walked into the living room where she saw three chairs.",
                   "Goldilocks sat in the first chair to rest her feet.",
                   "'This chair is too big!' she exclaimed'. So she sat in the second chair.",
                   "'This chair is too big, too!' she whined",
                   "So she tried the last and smallest chair.",
                   "'Ahhh, this chair is just right,' she sighed.",
                   "But just as she settled down into the chair to rest, it broke into pieces!",
                   "Goldilocks was very tired by this time, so she went upstairs to the bedroom.",
                   "She lay down in the first bed, but it was too hard.",
                   "Then she lay in the second bed, but it was too soft.",
                   "Then she lay down in the third bed and it was just right. Goldilocks fell asleep."
                 ]

/* Randomly generate original text */
var randIndex = Math.floor(Math.random() * (testList.length));
originText.innerHTML = testList[randIndex];
var words = originText.innerHTML.split(" ").length;

/*  Run a standard minute : second . hundredths timer: */
var hundreds = 0;
var seconds  = 0;
var minutes  = 0;
function timer() {
    hundreds++;
    if (hundreds == 100) {  // reset hundreds and increase second
        hundreds = 0;
        seconds++;      
    }
    if (seconds == 60) {   // reset seconds and increase minutes
        seconds = 0;       
        minutes++;
    }
   
    // Add leading zero to numbers 9 or below (purely for aesthetics):
    theTimer.innerHTML = [ (minutes < 10  ? "0" + minutes  : minutes), ":", 
                           (seconds < 10  ? "0" + seconds  : seconds), ".",
                           (hundreds < 10 ? "0" + hundreds : hundreds)
                          ].join("");
}

/* Match the text entered with the provided text on the page: */

var log1 = document.querySelector('#log1');     // display updated typing progress
var log2 = document.querySelector('#log2');     // display final stat of typing performance

// Return true if key is either a backspace or 'delete' key, false otherwise:
function isDeletted (code) {
    return code == 8 || code== 46;
}

// Return true if key is an alphanumeric character, false otherwise:
function isAlphaNum (code) {
    return (code >= 48 && code <= 57) || (code >= 65 && code <= 90);
}

// Return true if key is a text symbol (, . ? ; etc), false otherwise:
function isSymbol (code) {
    return code >= 186 && code <= 222;
}

// Return true if key is a spacebar/Enter, false otherwise:
function isSpace (code) {
    return code == 13 || code == 32;
}

// Read and compare texts character by character
var str = "";                       // string contains typed characters
var timerInterval;
var k = 0;                          // index of the current character in the original text
var incorrect = 0;                  // count of incorrectly-typed characters
var time;                           // total typing time in minutes
function readChar(e) {

    // Stop theTimer and disable textArea once the texts match
    if (str == originText.innerHTML) {
        testWrapper.style.border = "10px solid #429890";
        clearInterval(timerInterval);
        testArea.disabled = true;
        // Display final results
        time = minutes + seconds/60 + hundreds/6000;
        log2.innerText = [ "-- Results --", 
                           "\nWords Typed:", words, 
                           "\nApproximated Time:", time.toFixed(3), "(minutes)",
                           "\nTyping Speed:", (words/time).toFixed(1), "(wpm)",
                           "\nErrors:", incorrect, "(strikes)"
                         ].join(' ');
    }
    
    // Correct key is hit:
    if ((isSpace(e.keyCode) && originText.innerHTML[k] == " ") || (originText.innerHTML[k] == e.key)) {
        testWrapper.style.border = "10px solid #0D1B2E";
    }
    // Incorrect key is hit:
    else if (isAlphaNum(e.keyCode) || isSymbol(e.keyCode)) {
        testWrapper.style.border = "10px solid #E95D0F";
        incorrect++;
    }

    // Erase the last character of the string if backpace or delete key is hit:
    if (isDeletted(e.keyCode)) {
        str = str.slice(0, -1);
        testWrapper.style.border = "10px solid grey";
        k = k > 0 ? k - 1 : 0;
    }
    // Add key to string if a normal character (letters, digits, text symbols, space bar, Enter) is hit:    
    else if (isAlphaNum(e.keyCode) || isSymbol(e.keyCode) || isSpace(e.keyCode)) {
        // Treat Enter key same as spacebar key
        str += isSpace(e.keyCode) ? " " : e.key; 
        k++;               
    }

    // Display current stat
    log1.innerText = [ "-- Your Progress --",
                       "\nKeys Typed:", k, 
                       "\nKeys Remained:", Math.max(originText.innerHTML.length - k, 0), 
                       "\nWrong Keys:", incorrect 
                     ].join(' ');
}
testArea.addEventListener("keydown", readChar);

/* Start the timer: */
var resetted = true;
function startTimer() {
    if (str.length == 1 && resetted) {
        timerInterval = setInterval(timer, 10);
        resetted = false;
    }  
}
testArea.addEventListener("keydown", startTimer);

/* Reset everything: */
function resetTimer() {
    if (!resetted) {
        clearInterval(timerInterval);
        hundreds = seconds = minutes = 0;
        theTimer.innerHTML = "00:00.00";
        resetButton.innerHTML = "Start Over";
        testArea.value = testArea.innerHTML = str = "";
        log1.value = log1.innerHTML = "";
        log2.value = log2.innerHTML = "";
        resetted = true;
        testArea.disabled = false;
        testWrapper.style.border = "10px solid grey";
        k = incorrect = 0;
        randIndex = Math.floor(Math.random() * (testList.length));
        originText.innerHTML = testList[randIndex];
    }
}
resetButton.addEventListener("click", resetTimer , false);
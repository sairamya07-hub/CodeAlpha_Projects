let flashcards =
JSON.parse(localStorage.getItem("flashcards")) || [];

let currentCard = 0;
let showingAnswer = false;

function saveCards(){
localStorage.setItem(
"flashcards",
JSON.stringify(flashcards)
);
}

function displayCard(){

const card =
document.getElementById("cardContent");

if(flashcards.length === 0){

card.innerHTML =
"No Flashcards Available<br>Add one to get started!";

return;
}

if(showingAnswer){

card.innerText =
flashcards[currentCard].answer;

}else{

card.innerText =
flashcards[currentCard].question;

}
}

function flipCard(){

if(flashcards.length === 0) return;

showingAnswer = !showingAnswer;

displayCard();
}

function addCard(){

const question =
document.getElementById("newQuestion").value;

const answer =
document.getElementById("newAnswer").value;

if(question === "" || answer === ""){

alert("Please enter both question and answer");
return;
}

flashcards.push({
question,
answer
});

saveCards();

document.getElementById("newQuestion").value = "";
document.getElementById("newAnswer").value = "";

currentCard = flashcards.length - 1;

showingAnswer = false;

displayCard();
}

function nextCard(){

if(flashcards.length === 0) return;

currentCard++;

if(currentCard >= flashcards.length){

currentCard = 0;

}

showingAnswer = false;

displayCard();
}

function prevCard(){

if(flashcards.length === 0) return;

currentCard--;

if(currentCard < 0){

currentCard = flashcards.length - 1;

}

showingAnswer = false;

displayCard();
}

function editCard(){

if(flashcards.length === 0) return;

const question = prompt(
"Edit Question",
flashcards[currentCard].question
);

const answer = prompt(
"Edit Answer",
flashcards[currentCard].answer
);

if(question && answer){

flashcards[currentCard].question = question;
flashcards[currentCard].answer = answer;

saveCards();

showingAnswer = false;

displayCard();
}
}

function deleteCard(){

if(flashcards.length === 0) return;

flashcards.splice(currentCard,1);

saveCards();

if(currentCard >= flashcards.length){

currentCard = flashcards.length - 1;

}

showingAnswer = false;

displayCard();
}

displayCard();
const quotes = [
{
quote:"Arise, awake and stop not till the goal is reached.",
author:"Swami Vivekananda"
},
{
quote:"Dream is not that which you see while sleeping, it is something that does not let you sleep.",
author:"A.P.J. Abdul Kalam"
},
{
quote:"Success is when your signature becomes an autograph.",
author:"A.P.J. Abdul Kalam"
},
{
quote:"I don't believe in taking right decisions. I take decisions and then make them right.",
author:"Ratan Tata"
},
{
quote:"Ups and downs in life are very important to keep us going.",
author:"Ratan Tata"
},
{
quote:"The future depends on what you do today.",
author:"A.P.J. Abdul Kalam"
},
{
quote:"Stay hungry, stay foolish.",
author:"Steve Jobs"
},
{
quote:"The only way to do great work is to love what you do.",
author:"Steve Jobs"
},
{
quote:"Your time is limited, so don't waste it living someone else's life.",
author:"Steve Jobs"
},
{
quote:"Success is a lousy teacher. It seduces smart people into thinking they can't lose.",
author:"Bill Gates"
},
{
quote:"The biggest risk is not taking any risk.",
author:"Mark Zuckerberg"
},
{
quote:"Move fast and break things.",
author:"Mark Zuckerberg"
},
{
quote:"I've failed over and over and over again in my life and that is why I succeed.",
author:"Michael Jordan"
},
{
quote:"Someone is sitting in the shade today because someone planted a tree a long time ago.",
author:"Warren Buffett"
},
{
quote:"The best way to predict the future is to create it.",
author:"Peter Drucker"
},
{
quote:"If you want to shine like a sun, first burn like a sun.",
author:"A.P.J. Abdul Kalam"
},
{
quote:"Take risks in your life. If you win, you can lead; if you lose, you can guide.",
author:"Swami Vivekananda"
},
{
quote:"Don't compare yourself with anyone in this world.",
author:"Bill Gates"
},
{
quote:"Innovation distinguishes between a leader and a follower.",
author:"Steve Jobs"
},
{
quote:"Hard work beats talent when talent doesn't work hard.",
author:"Tim Notke"
}
];

function generateQuote(){

const random=Math.floor(Math.random()*quotes.length);

document.getElementById("quote").innerText=
quotes[random].quote;

document.getElementById("author").innerText=
"- "+quotes[random].author;

}

generateQuote();
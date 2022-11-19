var randomNumber1;
var images1;
var images2;
function play1() {
  randomNumber1 = Math.floor(Math.random() * 6) + 1;
  images1 = "images/dice" + randomNumber1 + ".png";
  document.querySelector(".dice .img1").setAttribute("src", images1);
}

function play2() {
  var randomNumber2 = Math.floor(Math.random() * 6) + 1;
  images2 = "images/dice" + randomNumber2 + ".png";
  document.querySelector(".dice .img2").setAttribute("src", images2);

  if (randomNumber1 > randomNumber2) {
    document.querySelector("h1").innerHTML = "⛳Player 1 Won";
  } else if (randomNumber1 < randomNumber2) {
    document.querySelector("h1").innerHTML = "Player 2 Won⛳";
  } else document.querySelector("h1").innerHTML = "Draw!";
}

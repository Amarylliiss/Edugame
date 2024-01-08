

let emoji = document.querySelector(".emoji");

let colors = ["#4bff81", "#4bb4ff", "#ff702e", "#b88cff", "#ffd21f"];
let eyes = document.querySelector(".eyes");
let eyebrows = document.querySelector(".eyebrows");
let mouth = document.querySelector(".mouth");

let colorBtn = document.getElementById("color");
let eyesBtn = document.getElementById("eyes");
let eyebrowsBtn = document.getElementById("eyebrows");
let mouthBtn = document.getElementById("mouth");


let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
let counter4 = 0;


let totalCounts = {
    eyeCount: 3,
    eyebrowsCount: 3,
    mouthCount: 4,
};


colorBtn.addEventListener("click", () => {
    emoji.style.backgroundColor = colors[counter1];
    counter1 = counter1 < colors.length - 1 ? counter1 + 1 : 0;
    console.log(counter1);
});

eyesBtn.addEventListener("click", () => {
    eyes.setAttribute("src", `images/eyes-${counter2}.svg`);
    counter2 = counter2 < totalCounts.eyeCount - 1 ? counter2 + 1 : 0;
});

eyebrowsBtn.addEventListener("click", () => {
    eyebrows.setAttribute("src", `images/brows-${counter3}.svg`);
    counter3 = counter3 < totalCounts.eyebrowsCount - 1 ? counter3 + 1 : 0;
});

mouthBtn.addEventListener("click", () => {
    mouth.setAttribute("src", `images/mouth-${counter4}.svg`);
    counter4 = counter4 < totalCounts.mouthCount - 1 ? counter4 + 1 : 0;
});




let signupForm = document.querySelector(".my-form");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirm-password");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("Email:", email.value);
  console.log("Password:", password.value);
});

function onChange() {
  if (confirmPassword.value === password.value) {
    confirmPassword.setCustomValidity("");
  } else {
    confirmPassword.setCustomValidity("Passwords do not match!");
  }
}

password.addEventListener("change", onChange);
confirmPassword.addEventListener("change", onChange);
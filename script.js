const name = localStorage.getItem("userName") || "user";

const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function setTime() {
  const time = new Date();
  const month = time.getMonth();
  const year = time.getFullYear();

  const day = time.getDay();
  const date = time.getDate();
  const hours = time.getHours();
  const hoursForClock = hours >= 13 ? hours % 12 : hours;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  if (timeEl && dateEl) {
    timeEl.innerHTML = `${hoursForClock.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    dateEl.innerHTML = `${days[day]}, ${months[month]} ${date}, ${year}`;
  }
}

setTime();
setInterval(setTime, 1000);

const time = new Date().getHours();

let greeting;

if (time < 7) {
  greeting = `Very Good morning ${name}! <br> We're delighted to see you here so early.`;
} else if (time < 12) {
  greeting = `Good morning ${name}! <br> It's a beautiful morning and we're thrilled to have you join us on our website.`;
} else if (time < 14) {
  greeting = `Good afternoon ${name}! <br> It's time to have lunch.`;
} else if (time < 16) {
  greeting = `Good afternoon ${name}! <br> We're so happy to have you join us on our website.`;
} else if (time < 20) {
  greeting = `Good evening ${name}! <br> how are you doing today?`;
} else if (time < 22) {
  greeting = `Good night ${name}! <br> Thanks for stopping by at night! We hope you find what you're looking for.`;
} else {
  greeting = `Good night ${name}! <br> it's time to sleep, we are so glad to see you at late night.`;
}

const greetEl = document.getElementById("greet");
if (greetEl) {
  greetEl.innerHTML = greeting;
}

const accountBtn = document.getElementById("accountBtn");
const accountBox = document.querySelector('#accountBox');

if (accountBtn && accountBox) {
  if (localStorage.getItem('userName')) {
    accountBtn.innerHTML = "Manage Account";
accountBtn.href ="./menu/manageAccount.html";
    accountBox.style.display = 'none';
  } else {
    accountBtn.innerHTML = "Create Account";
accountBtn.href ="./menu/createAccount.html";
    accountBox.style.display = 'block';
  }
}
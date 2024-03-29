$(document).ready(function () {
  const accountBtn = document.getElementById("accountBtn");
  const loginBtn = document.getElementById("loginBtn");

  if (accountBtn && loginBtn) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        accountBtn.innerHTML = "Manage Account";
        accountBtn.href = "./manageAccount.html";
        loginBtn.style.display = 'none';
      } else {
        accountBtn.innerHTML = "Create Account";
        accountBtn.href = "./createAccount.html";
        loginBtn.style.display = 'block';
        loginBtn.href = "./login.html";
      }
    });
  }

  $('.menuBtn').click(function () {
    $('.drawer').toggle(500);
  });
});

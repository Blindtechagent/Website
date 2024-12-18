$(document).ready(function () {
  // toggling the navigation drawer
  const accountBtn = document.getElementById("accountBtn");
  const loginBtn = document.getElementById("loginBtn");
  const menuBtn = $('.menuBtn');
  const menuItems = $('#menuItems');

  if (accountBtn && loginBtn) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        accountBtn.innerHTML = "Manage Account";
        accountBtn.href = "../menu/manageAccount.html";
        loginBtn.style.display = 'none';
      } else {
        accountBtn.innerHTML = "Create Account";
        accountBtn.href = "../menu/createAccount.html";
        loginBtn.style.display = 'block';
        loginBtn.href = "../menu/login.html";
      }
    });
  }

  if (menuBtn.length > 0 && menuItems.length > 0) {
    menuBtn.click(function () {
      const isHidden = menuItems.css("display") === "none";
      menuItems.toggle(500);
      menuBtn.attr("aria-expanded", !isHidden);
      menuBtn.attr("aria-label", isHidden ? "Close Navigation Menu" : "Open Navigation Menu");
    });
  }

  // copy funtionality from any text
  const copyBtn = document.querySelector(".copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      const textToCopy = document.querySelector(".textCopy").innerText;
      navigator.clipboard.writeText(textToCopy)
        .then(() => announce("Text copied successfully!"))
        .catch((err) => console.error("Copy failed:", err));
    });
  }

  // copy funcionality from any edit box
  const copyTextBoxBtn = document.querySelector(".copyTextBoxBtn");
  if (copyTextBoxBtn) {
    copyTextBoxBtn.addEventListener("click", function () {
      const textBoxCopy = document.querySelector(".textBoxCopy");
      navigator.clipboard.writeText(textBoxCopy.value)
        .then(() => announce("Text copied successfully!"))
        .catch((err) => console.error("Copy failed:", err));
    });
  }
});

function announce(message) {
  var announcement = document.getElementById("announcement");
  announcement.textContent = message;
  setTimeout(function () {
    announcement.style.display = "none";
  }, 3000);
  announcement.style.display = "block";
}

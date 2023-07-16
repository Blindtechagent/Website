firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in, show content for logged-in users
    showLoggedInContent();
  } else {
    // User is not signed in, show content for non-logged-in users
    showNonLoggedInContent();
  }
});

function showLoggedInContent() {
  // Show elements that are only visible to logged-in users
  document.getElementById('loggedin-section').style.display = 'block';
  document.getElementById('non-loggedin-section').style.display = 'none';
}

function showNonLoggedInContent() {
  // Show elements that are only visible to non-logged-in users
  document.getElementById('loggedin-section').style.display = 'none';
  document.getElementById('non-loggedin-section').style.display = 'block';
}

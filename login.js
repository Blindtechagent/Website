const firebaseConfig = {
  apiKey: "AIzaSyDHMNnIoAwyqrNP7AEDkMX2jup8L8shiTk",
  authDomain: "blind-tech-agent-5c78e.firebaseapp.com",
  projectId: "blind-tech-agent-5c78e",
  storageBucket: "blind-tech-agent-5c78e.appspot.com",
  messagingSenderId: "524768280922",
  appId: "1:524768280922:web:8b6e7693d711a38ccab363",
  measurementId: "G-1T12NRRERE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Login Form
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', loginUser);

function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // Use Firebase Authentication API to sign in the user
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // Redirect to the homepage or another desired page
      window.location.href = "home.html";
    })
    .catch(function(error) {
      // Handle login errors
      if (error.code === 'auth/user-not-found') {
        alert('There is no account with this email. Please create an account first.');
        window.location.href = "signup.html";
      } else {
        console.error("Login error:", error);
        alert("An error occurred. Please try again.");
      }
    });
}
// Add event listener for "Forgot Password" link
const forgotPasswordLink = document.getElementById("forgot-password-link");
forgotPasswordLink.addEventListener('click', handleForgotPassword);

function handleForgotPassword(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;

  // Send password reset email to the user's email address
  firebase.auth().sendPasswordResetEmail(email)
    .then(function() {
      // Password reset email sent successfully
      alert('Password reset email has been sent. Please check your inbox.');
    })
    .catch(function(error) {
      // Handle password reset email sending error
      console.error("Password reset email error:", error);
      alert("An error occurred while sending the password reset email. Please try again.");
    });
}

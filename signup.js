import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHMNnIoAwyqrNP7AEDkMX2jup8L8shiTk",
  authDomain: "blind-tech-agent-5c78e.firebaseapp.com",
  projectId: "blind-tech-agent-5c78e",
  storageBucket: "blind-tech-agent-5c78e.appspot.com",
  messagingSenderId: "524768280922",
  appId: "1:524768280922:web:8b6e7693d711a38ccab363",
  measurementId: "G-1T12NRRERE",
  databaseURL: "https://blind-tech-agent-5c78e-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form from submitting normally

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  // Create user with email and password
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Account created successfully
      const user = userCredential.user;

      // Save user's name in Firebase database
      saveUserName(user.uid, name);

      const message = `Account created successfully. Welcome, ${name}! Please log in with your account.`;
      alert(message);
      window.location.replace('login.html'); // Redirect to home.html
    })
    .catch((error) => {
      // Handle account creation error
      if (error.code === 'auth/email-already-in-use') {
        alert('Account already exists. Please log in to your account.');
        window.location.replace('login.html'); // Redirect to login.html
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email format. Please enter a valid email address.');
      } else {
        alert('An error occurred. Please try again.');
      }
    });
});

function saveUserName(userId, name) {
  firebase.database().ref('users/' + userId).set({
    name: name
  });
}
const firebaseConfig = {
apiKey: "AIzaSyCMk9JONRfCaIvDUPjFsC7CHGPhy0uZES0",
authDomain: "blind-tech-agent-e4eb9.firebaseapp.com",
  databaseURL: "https://blind-tech-agent-e4eb9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blind-tech-agent-e4eb9",
storageBucket: "blind-tech-agent-e4eb9.appspot.com",
messagingSenderId: "32698440215",
appId: "1:32698440215:web:242af943daa0389e5a9a52",
measurementId: "G-4BV61CLBDP"
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
      window.location.replace('home.html'); // Redirect to home.html
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

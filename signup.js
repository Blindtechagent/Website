
const form = document.getElementById('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form from submitting normally

  const email = emailInput.value;
  const password = passwordInput.value;

  // Create user with email and password
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Account created successfully
      const user = userCredential.user;
      const userId = user.uid; // Get the unique user ID

      const userName = document.getElementById("name").value;

      // Save the user's name to the database using the unique user ID as the key
      firebase.database().ref("users/" + userId).set({
        name: userName
      })
      .then(() => {
        const message = 'Account created successfully. Please log in with your new account.';
        alert(message);
        window.location.href = 'login.html'; // Redirect to login.html
      })
      .catch((error) => {
        // Handle database save error
        console.error("Database save error:", error);
        alert("An error occurred while saving data. Please try again.");
      });
    })
    .catch((error) => {
      // Handle account creation error
      if (error.code === 'auth/email-already-in-use') {
        alert('Account already exists. Please log in to your account.');
        window.location.href = 'login.html'; // Redirect to login.html
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email format. Please enter a valid email address.');
      } else {
        alert('An error occurred. Please try again.');
      }
    });
});

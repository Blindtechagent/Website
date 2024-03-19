
const r = document.getElementById('result');
const g = document.getElementById('generate');
const s = document.getElementById('save');
const c = document.querySelector('.copyBtn');
const rt = document.getElementById('retrieve');
const spl = document.getElementById('savedPasswordsList');
const spc = document.getElementById('savedPasswordsContainer');

// Function to generate password
function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
      const uppercase = document.getElementById('uppercase').checked;
      const lowercase = document.getElementById('lowercase').checked;
      const numbers = document.getElementById('numbers').checked;
      const symbols = document.getElementById('symbols').checked;

      const characterSet = [];

      if (uppercase) {
        for (let i = 65; i <= 90; i++) {
          characterSet.push(String.fromCharCode(i));
        }
      }

      if (lowercase) {
        for (let i = 97; i <= 122; i++) {
          characterSet.push(String.fromCharCode(i));
        }
      }

      if (numbers) {
        for (let i = 48; i <= 57; i++) {
          characterSet.push(String.fromCharCode(i));
        }
      }

      if (symbols) {
        const symbolsList = "!@#$%^&*()_+=-{}[]<>?,.";
        for (let i = 0; i < symbolsList.length; i++) {
          characterSet.push(symbolsList.charAt(i));
        }
      }

      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterSet.length);
        password += characterSet[randomIndex];
      }

      return password;
}

// Function to generate and display password
function generateAndDisplayPassword() {
    const lengthInput = document.getElementById('length');
      const passwordLength = parseInt(lengthInput.value);
      if (isNaN(passwordLength) || passwordLength < 4 || passwordLength > 20) {
        announce('Please enter a valid password length between 4 and 20.');
        return;
      }

      const uppercase = document.getElementById('uppercase').checked;
      const lowercase = document.getElementById('lowercase').checked;
      const numbers = document.getElementById('numbers').checked;
      const symbols = document.getElementById('symbols').checked;

      if (!uppercase && !lowercase && !numbers && !symbols) {
        announce('Please select at least one character type.');
        return;
      }

      const password = generatePassword();
      if (password) {
        r.innerText = password;
        c.style.display = 'inline-block'; // Show copy button
        announce("password generated successfully");
      }
}

// Function to save password to Firebase
function savePassword() {
  const user = firebase.auth().currentUser;
  const emailId = user.email;
  if (!user) {
    announce('Please sign in to save passwords.');
    return;
  }
  
  const password = r.innerText;
  if (!password) {
    announce('No password generated to save.');
    return;
  }
  
  const title = prompt('Enter a title for the password, like: facebook password');
  if (!title) {
    announce('Title cannot be empty. Password not saved.');
    return;
  }
  
  try {
    const passwordObj = { title, password };
    firebase.database().ref("users/" + emailId.replace('.', ',') + "/savedPasswords").push(passwordObj);
    announce('Password saved successfully!');
  } catch (error) {
    announce('Failed to save password. Please try again.');
  }
}

// Function to show saved passwords from Firebase
// Function to show saved passwords from Firebase
function showSavedPasswords() {
  const user = firebase.auth().currentUser;
  const emailId = user.email;
  if (!user) {
    announce('Please sign in to retrieve saved passwords.');
    return;
  }
  
  try {
    firebase.database().ref("users/" + emailId.replace('.', ',') + "/savedPasswords").once('value')
      .then(snapshot => {
        const passwords = snapshot.val();
        if (!passwords) {
          announce('No saved passwords found.');
          return;
        }
        
        spl.innerHTML = '';
        Object.keys(passwords).forEach(key => {
          const passwordObj = passwords[key];
          const listItem = document.createElement('li');
          listItem.innerHTML = `<span class="title">${passwordObj.title}</span>
                                <span class="password textCopy">${passwordObj.password}</span>
                                <button class="copy copyBtn" aria-label="copy"><i class="btn far fa-clipboard"></i></button>
                                <button class="delete" onclick="deleteSavedPassword('${key}')" aria-label="Delete"><i class="btn fas fa-trash"></i></button>`;
          spl.appendChild(listItem);

          // Attach event listener to the copy button
          const copyBtn = listItem.querySelector('.copyBtn');
          copyBtn.addEventListener('click', function() {
            const textToCopy = passwordObj.password;
            navigator.clipboard.writeText(textToCopy)
              .then(() => {
                announce('Password copied to clipboard.');
              })
              .catch(err => {
                console.error('Failed to copy password:', err);
                announce('Failed to copy password to clipboard.');
              });
          });
        });
        
        spc.style.display = 'block';
        announce('Saved passwords retrieved successfully!'); 
      })
      .catch(error => {
        announce('Failed to retrieve saved passwords. Please try again.');
      });
  } catch (error) {
    announce('Failed to retrieve saved passwords. Please try again.');
  }
}

// Function to delete saved password from Firebase
function deleteSavedPassword(key) {
  const user = firebase.auth().currentUser;
  const emailId = user.email;
  if (!user) {
    announce('Please sign in to delete saved passwords.');
    return;
  }
  
  try {
    firebase.database().ref("users/" + emailId.replace('.', ',') + "/savedPasswords/" + key).remove()
      .then(() => {
        announce('Password deleted successfully!');
      })
      .catch(error => {
        announce('Failed to delete password. Please try again.');
      });
  } catch (error) {
    announce('Failed to delete password. Please try again.');
  }
}


// Event listeners
g.addEventListener('click', generateAndDisplayPassword);
s.addEventListener('click', savePassword);
rt.addEventListener('click', showSavedPasswords);

document.addEventListener('DOMContentLoaded', function () {
    const nameInput = document.getElementById('name');
    const urlInput = document.getElementById('url');
    const saveBtn = document.getElementById('saveBtn');
    const showSavedLinksBtn = document.getElementById('showBtn');
    const saveLinkContainer = document.querySelector('.save-link');
    const savedLinksContainer = document.querySelector('.saved-links');
    const linksList = document.getElementById('links-list');

    saveBtn.addEventListener('click', saveURL);
    showSavedLinksBtn.addEventListener('click', showSavedLinks);

    function saveURL() {
        const user = firebase.auth().currentUser;
        if (!user) {
            alert('You need to be logged in to save links.');
            return;
        }

        const emailId = user.email.replace('.', ',');
        const nameValue = nameInput.value.trim();
        const urlValue = urlInput.value.trim();

        if (!urlValue || !nameValue) {
            alert('Please enter all fields to save links.');
            return;
        }

        const urlOBJ = { nameValue, urlValue };
        firebase.database().ref(`users/${emailId}/savedURL`).push(urlOBJ)
            .then(() => {
                alert('Link saved successfully!');
            })
            .catch(error => {
                console.error('Error saving URL:', error);
                alert('Failed to save link. Please try again later.');
            });
    }

    function showSavedLinks() {
        const user = firebase.auth().currentUser;
        if (!user) {
            alert('You need to be logged in to view saved links.');
            return;
        }

        const emailId = user.email.replace('.', ',');
        firebase.database().ref(`users/${emailId}/savedURL`).once('value')
            .then(snapshot => {
                const links = snapshot.val();
                if (!links) {
                    alert('No saved links found.');
                    return;
                }

                linksList.innerHTML = '';
                Object.keys(links).forEach(key => {
                    const urlOBJ = links[key];
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span class="name">${urlOBJ.nameValue}</span>
                        <span class="link" onclick="openLink('${urlOBJ.urlValue}')">${urlOBJ.urlValue}</span>
                        <button class="copyBtn" onclick="copyToClipboard('${urlOBJ.urlValue}')">Copy</button>
                        <button class="deleteBtn" onclick="deleteSavedLink('${key}')">Delete</button>
                    `;
                    linksList.appendChild(listItem);
                });

                saveLinkContainer.style.display = 'none';
                savedLinksContainer.style.display = 'block';
            })
            .catch(error => {
                console.error('Error retrieving saved links:', error);
                alert('Failed to retrieve saved links. Please try again.');
            });
    }

    function deleteSavedLink(key) {
        const user = firebase.auth().currentUser;
        if (!user) {
            alert('You need to be logged in to delete links.');
            return;
        }

        const emailId = user.email.replace('.', ',');
        firebase.database().ref(`users/${emailId}/savedURL`).child(key).remove()
            .then(() => {
                alert('Link deleted successfully!');
                showSavedLinks();
            })
            .catch(error => {
                console.error('Error deleting link:', error);
                alert('Failed to delete link. Please try again.');
            });
    }

    window.copyToClipboard = function(url) {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(error => {
            console.error('Error copying link:', error);
            alert('Failed to copy link. Please try again.');
        });
    }

    window.openLink = function(url) {
        window.open(url, '_blank');
    }
});

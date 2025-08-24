    $(document).ready(function() {
        const urlParams = new URLSearchParams(window.location.search);
        const subjectKey = urlParams.get('subjectKey');
        const unitKey = urlParams.get('unitKey');
        const unitName = urlParams.get('unitName');

        if (!subjectKey || !unitKey || !unitName) {
            alert('Subject, Unit, or Unit Name not specified.');
            window.location.href = 'createContent.html';
            return;
        }

        document.getElementById('unitNameDisplay').textContent = unitName;

        const db = firebase.database().ref('education');
        const chaptersContainer = document.getElementById('chaptersContainer');
        const newChapterBox = document.getElementById('newChapterBox');
        const chapterForm = document.getElementById('chapter-form');

        // Corrected the regex to be valid in JavaScript for Firebase keys
        function safeKey(name) {
            return name.trim().replace(/[.#$[\/]]/g, "_");
        }

        chapterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const chapterName = document.getElementById('chapterName').value.trim();
            if (!chapterName) { alert('Please enter a chapter name.'); return; }
            const chapterKey = safeKey(chapterName);
            const unitRef = db.child(subjectKey).child('units').child(unitKey).child('chapters');

            unitRef.child(chapterKey).once('value').then(snapshot => {
                if (snapshot.exists()) {
                    alert('This chapter name already exists for this unit.');
                } else {
                    unitRef.child(chapterKey).set({ name: chapterName }).then(() => {
                        alert('Chapter added successfully! Now, let\'s add content.');
                        const url = `education-publisher.html?subjectKey=${subjectKey}&unitKey=${unitKey}&chapterKey=${chapterKey}&unitName=${encodeURIComponent(unitName)}&chapterName=${encodeURIComponent(chapterName)}`;
                        window.location.href = url;
                    });
                }
            }).catch(error => alert('Error: ' + error.message));
        });

        const chaptersRef = db.child(subjectKey).child('units').child(unitKey).child('chapters');
        chaptersRef.on('value', (chaptersSnapshot) => {
            chaptersContainer.innerHTML = '';
            if (!chaptersSnapshot.exists()) {
                chaptersContainer.innerHTML = '<p>No chapters found. Create one to get started.</p>';
            } else {
                chaptersSnapshot.forEach((chapterChildSnapshot) => {
                    const chapterKey = chapterChildSnapshot.key;
                    const chapterData = chapterChildSnapshot.val();
                    const chapterBtn = document.createElement('button');
                    chapterBtn.className = 'btn';
                    chapterBtn.textContent = chapterData.name;

                    chapterBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const url = `education-publisher.html?subjectKey=${subjectKey}&unitKey=${unitKey}&chapterKey=${chapterKey}&unitName=${encodeURIComponent(unitName)}&chapterName=${encodeURIComponent(chapterData.name)}`;
                        window.location.href = url;
                    });
                    chaptersContainer.appendChild(chapterBtn);
                });
            }
        });

        
    });
    
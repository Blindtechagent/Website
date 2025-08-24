document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const publishForm = document.getElementById('publish-form');
    const chapterNameDisplay = document.getElementById('chapter-name-display');
    const elementType = document.getElementById('elementType');
    const contentInput = document.getElementById('elementContent');
    const urlInputContainer = document.getElementById('urlInputContainer');
    const urlInput = document.getElementById('elementURL');
    const createBtn = document.getElementById('createBtn');
    

    // --- URL Parameter Handling ---
    const urlParams = new URLSearchParams(window.location.search);
    const subjectKey = urlParams.get('subjectKey');
    const unitKey = urlParams.get('unitKey');
    const chapterKey = urlParams.get('chapterKey');
    const unitName = urlParams.get('unitName');
    const chapterName = urlParams.get('chapterName');

    if (!subjectKey || !unitKey || !chapterKey) {
        alert('Missing critical information. Redirecting to the main page.');
        window.location.href = 'createContent.html';
        return;
    }

    // --- Display Chapter Name & Set Title ---
    if (chapterName) {
        const decodedChapterName = decodeURIComponent(chapterName);
        chapterNameDisplay.textContent = `Editing: ${decodedChapterName}`;
        document.title = `Editor: ${decodedChapterName}`;
    }

    // --- Firebase Database Reference ---
    const db = firebase.database();
    const chapterContentRef = db.ref(`education/${subjectKey}/units/${unitKey}/chapters/${chapterKey}/content`);

    // --- Core Functions ---

    function getCleanHtml() {
        let finalHtml = '';
        const containers = output.querySelectorAll('div');
        containers.forEach(container => {
            const element = container.firstElementChild.cloneNode(true);
            element.contentEditable = false;
            finalHtml += element.outerHTML;
        });
        return finalHtml;
    }

    

    

    function loadContent(htmlString) {
        output.innerHTML = '';
        if (!htmlString) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        Array.from(doc.body.children).forEach(el => {
            el.contentEditable = true;
            const container = document.createElement('div');
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = function() {
                if (confirm('Are you sure you want to remove this element?')) {
                    container.remove();
                }
            };

            container.appendChild(el);
            container.appendChild(removeBtn);
            output.appendChild(container);
        });
    }

    // --- Load Existing Content with Diagnostics ---
    chapterContentRef.once('value').then(snapshot => {
        loadContent(snapshot.val());
    }).catch(error => {
        console.error('Error loading content:', error);
        alert(`CRITICAL ERROR: Could not load content from the database.\n\nError: ${error.message}`);
    });

    // --- Event Listeners ---

    elementType.addEventListener('change', () => {
        const type = elementType.value;
        urlInputContainer.style.display = (type === 'a') ? 'block' : 'none';
        contentInput.style.display = (type === 'hr' || type === 'br') ? 'none' : 'block';
        contentInput.placeholder = (type === 'ul' || type === 'ol') 
            ? 'Enter list items, one per line.' 
            : 'Type your text here.';
        if (type === 'a') contentInput.placeholder = 'Type the link text here.';
    });

    createBtn.addEventListener('click', () => {
        const type = elementType.value;
        const content = contentInput.value.trim();
        const url = urlInput.value.trim();

        if (type !== 'hr' && type !== 'br' && !content) {
            alert('Content is required for this element type.');
            return;
        }
        if (type === 'a' && !url) {
            alert('Please enter a URL for the link.');
            return;
        }

        let el;
        if (type === 'ul' || type === 'ol') {
            el = document.createElement(type);
            content.split('\n').forEach(line => {
                if (line.trim()) {
                    const li = document.createElement('li');
                    li.textContent = line.trim();
                    el.appendChild(li);
                }
            });
        } else {
            el = document.createElement(type);
            if (type === 'a') {
                el.href = url;
                el.target = '_blank';
                el.textContent = content;
            } else if (type !== 'hr' && type !== 'br') {
                el.textContent = content;
            }
        }

        el.contentEditable = true;

        const container = document.createElement('div');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = function() {
            if (confirm('Are you sure you want to remove this element?')) {
                container.remove();
            }
        };

        container.appendChild(el);
        container.appendChild(removeBtn);
        output.appendChild(container);

        contentInput.value = '';
        urlInput.value = '';
    });

    

    const deleteAllBtn = document.getElementById('deleteAll');

    deleteAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete all content? This action cannot be undone.')) {
            output.innerHTML = '';
        }
    });

    publishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const finalHtml = getCleanHtml();

        chapterContentRef.set(finalHtml).then(() => {
            alert('Content published successfully!');
            if (unitName) {
                window.location.href = `manageChapters.html?subjectKey=${subjectKey}&unitKey=${unitKey}&unitName=${encodeURIComponent(unitName)}`;
            }
        }).catch((error) => {
            console.error('Error publishing content:', error);
            alert(`CRITICAL ERROR: Could not save content to the database.\n\nError: ${error.message}`);
        });
    });

    // Initialize UI on page load
    elementType.dispatchEvent(new Event('change'));
});
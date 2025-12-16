const contentList = document.querySelector('#content-list');
const contentContainer = document.querySelector('#content-container');
const contextHeading = document.querySelector('#context-heading');
const chipYear = document.querySelector('#chip-year');
const chipSubject = document.querySelector('#chip-subject');
const dateiName = document.querySelector('#datei-name');
const downloadLink = document.querySelector('#download-link');
const fileViewer = document.querySelector('#file-viewer');
const emptyState = document.querySelector('#empty-state');
const filterInput = document.querySelector('#material-filter');

const url = new URL(location.href);
const selectedYear = url.searchParams.get('jahr');
const selectedSubject = url.searchParams.get('fach');
const currentFile = url.searchParams.get('file');
const isLoggedIn = !!sessionStorage.getItem('token');
const userRole = sessionStorage.getItem('role');
const canManageContent = isLoggedIn && (userRole === 'ADMIN' || userRole === 'TEACHER');

const subjectLabels = {
    deutsch: 'Deutsch',
    mathematik: 'Mathematik',
    englisch: 'Englisch',
    biologie: 'Biologie',
    franzoesisch: 'Französisch',
    latein: 'Latein',
    chemie: 'Chemie',
    physik: 'Physik',
    politik: 'Politik',
    informatik: 'Informatik'
};

const materials = [
    { name: 'Mathe Übungsset Brüche', file: 'bspl3.pdf', year: '5', subject: 'mathematik', type: 'PDF' }
];

const uploadPanel = document.getElementById('upload-panel');
const fileUploadForm = document.getElementById('file-upload-form');
const textBlockForm = document.getElementById('text-block-form');
const fileSubjectSelect = document.getElementById('file-subject-select');
const fileTopicSelect = document.getElementById('file-topic-select');
const textSubjectSelect = document.getElementById('text-subject-select');
const textTopicSelect = document.getElementById('text-topic-select');
const materialFileInput = document.getElementById('material-file');
const textBlockTitle = document.getElementById('text-block-title');
const textBlockPosition = document.getElementById('text-block-position');
const textBlockContent = document.getElementById('text-block-content');
const fileUploadMessage = document.getElementById('file-upload-message');
const textBlockMessage = document.getElementById('text-block-message');
const subjectSelects = document.querySelectorAll('[data-subject-select]');
const fileUploadButton = fileUploadForm?.querySelector('button[type="submit"]');
const textBlockButton = textBlockForm?.querySelector('button[type="submit"]');

const formatSubjectLabel = (value) => {
    if (!value) return '';
    const normalized = value.toLowerCase();
    return subjectLabels[normalized] || value.charAt(0).toUpperCase() + value.slice(1);
};

const setHeading = () => {
    const subjectLabel = formatSubjectLabel(selectedSubject) || 'Alle Fächer';
    const yearLabel = selectedYear ? `Jahr ${selectedYear}` : 'Alle Jahrgänge';
    const heading = selectedYear || selectedSubject ? `${yearLabel} – ${subjectLabel}` : 'Materialübersicht';
    contextHeading.textContent = heading;
    chipYear.textContent = yearLabel;
    chipSubject.textContent = subjectLabel;
};

// --- Sidebar: Jahrgangs-Accordion ---

const closeAllYearSubjects = () => {
    document.querySelectorAll('#sidebar-menu .year-subjects').forEach(list => {
        list.classList.add('hidden');
    });
};

const attachYearToggles = () => {
    document.querySelectorAll('#sidebar-menu .year-link').forEach(link => {
        link.addEventListener('click', (event) => {
            if (link.closest('.home-item')) {
                return;
            }

            event.preventDefault();
            const container = link.closest('.year-item');
            if (!container) return;
            const subjects = container.querySelector('.year-subjects');
            if (!subjects) return;

            const wasHidden = subjects.classList.contains('hidden');
            closeAllYearSubjects();
            if (wasHidden) {
                subjects.classList.remove('hidden');
            } else {
                subjects.classList.add('hidden');
            }
        });
    });
};

const openSelectedYear = () => {
    if (selectedYear) {
        closeAllYearSubjects();
        const targetItem = document.querySelector(`#sidebar-menu .year-item[data-year="${selectedYear}"]`);
        if (targetItem) {
            const subjects = targetItem.querySelector('.year-subjects');
            if (subjects) subjects.classList.remove('hidden');
            if (selectedSubject) {
                document.querySelectorAll('#sidebar-menu .year-subjects a').forEach(link => link.classList.remove('active'));
                const activeLink = targetItem.querySelector(`.year-subjects a[href*="fach=${selectedSubject}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        }
    } else {
        closeAllYearSubjects();
    }
};

document.addEventListener('click', (event) => {
    const clickedInsideYearList = event.target.closest('#sidebar .year-item');
    if (!clickedInsideYearList) {
        closeAllYearSubjects();
    }
});

// --- Materialliste & Detailansicht ---

const updateUrl = (fileName) => {
    const linkUrl = new URL(location.href);
    if (selectedYear) linkUrl.searchParams.set('jahr', selectedYear);
    else linkUrl.searchParams.delete('jahr');
    if (selectedSubject) linkUrl.searchParams.set('fach', selectedSubject);
    else linkUrl.searchParams.delete('fach');
    if (fileName) linkUrl.searchParams.set('file', fileName);
    else linkUrl.searchParams.delete('file');
    history.replaceState({}, '', linkUrl);
};

const showFile = (material) => {
    if (!isLoggedIn) {
        showLoginGate();
        return;
    }
    if (!material) {
        contentContainer.classList.remove('hidden-block');
        emptyState.classList.remove('hidden-block');
        fileViewer.src = '';
        downloadLink.href = '';
        dateiName.textContent = 'Bitte wählen Sie eine Datei';
        updateUrl(null);
        return;
    }

    emptyState.classList.add('hidden-block');
    dateiName.textContent = material.name;
    const filePath = 'content/' + material.file;
    downloadLink.href = filePath;
    downloadLink.download = material.file;
    downloadLink.classList.remove('disabled');
    fileViewer.src = filePath;
    contentContainer.classList.remove('hidden-block');
    updateUrl(material.file);
};


const renderList = (filterText = '') => {
    contentList.innerHTML = '';
    const query = filterText.trim().toLowerCase();
    const filtered = materials.filter(item => {
        const matchesYear = selectedYear ? item.year === selectedYear : true;
        const matchesSubject = selectedSubject ? item.subject === selectedSubject : true;
        const matchesQuery = query ? (item.name.toLowerCase().includes(query) || item.file.toLowerCase().includes(query)) : true;
        return matchesYear && matchesSubject && matchesQuery;
    });

    if (!filtered.length) {
        const empty = document.createElement('li');
        empty.textContent = 'Keine Materialien gefunden.';
        contentList.append(empty);
        showFile(null);
        return;
    }

    filtered.forEach(item => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'material-item';
        link.setAttribute('data-file', item.file);
        link.innerHTML = `
            <div>
                <div class="material-title">${item.name}</div>
                <div class="material-meta">${item.type} · Jahr ${item.year} · ${formatSubjectLabel(item.subject)}</div>
            </div>
        `;
        link.addEventListener('click', (evt) => {
            evt.preventDefault();
            if (!isLoggedIn) {
                showLoginGate();
                return;
            }
            showFile(item);
        });
        li.append(link);
        contentList.append(li);
    });
};

// --- Sidebar-Toggle ---

const toggleButton    = document.getElementById('sidebar-toggle-button');
const sidebar         = document.getElementById('sidebar');
const closeButton     = document.getElementById('sidebar-close-button');

const setInitialSidebarState = () => {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('show');
    } else {
        sidebar.classList.add('show');
        sidebar.classList.remove('hidden');
    }
};

setInitialSidebarState();
window.addEventListener('resize', setInitialSidebarState);

toggleButton?.addEventListener('click', () => {
    toggleButton.classList.toggle('active');
    sidebar.classList.toggle('hidden');
    sidebar.classList.toggle('show');
});

closeButton?.addEventListener('click', () => {
    sidebar.classList.add('hidden');
    sidebar.classList.remove('show');
    toggleButton?.classList.remove('active');
});

// --- Init ---
const showLoginGate = () => {
    dateiName.textContent = 'Bitte zuerst anmelden';
    downloadLink.href = 'login.html';
    downloadLink.removeAttribute('download');
    downloadLink.classList.add('disabled');
    emptyState.classList.remove('hidden-block');
    if (emptyState) {
        const info = emptyState.querySelector('p');
        if (info) info.textContent = 'Melden Sie sich an, um Materialien anzusehen und herunterzuladen.';
    }
    fileViewer.src = '';
    contentContainer.classList.remove('hidden-block');
    updateUrl(null);
};

// --- Upload Panel (Teachers/Admins) ---

const topicCache = new Map();
let cachedSubjects = [];

const setStatusMessage = (element, message = '', type = '') => {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('success', 'error');
    if (type) {
        element.classList.add(type);
    }
};

const resetTopicSelect = (select) => {
    if (!select) return;
    select.innerHTML = '<option value="">Bitte zuerst ein Fach wählen</option>';
    select.disabled = true;
};

const populateSubjectSelects = (subjects) => {
    subjectSelects.forEach((select) => {
        if (!select) return;
        select.innerHTML = '<option value="">Fach auswählen</option>';
        subjects.forEach((subject) => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            select.append(option);
        });
        select.disabled = false;
        const topicTarget = document.getElementById(select.dataset.topicTarget || '');
        resetTopicSelect(topicTarget);
    });
};

const loadSubjects = async () => {
    if (cachedSubjects.length) return cachedSubjects;
    cachedSubjects = await window.api.getSubjects();
    return cachedSubjects;
};

const loadTopicsForSubject = async (subjectId) => {
    if (!subjectId) return [];
    if (topicCache.has(subjectId)) return topicCache.get(subjectId);
    const topics = await window.api.getTopicsForSubject(subjectId);
    topicCache.set(subjectId, topics);
    return topics;
};

const handleSubjectChange = async (select) => {
    const topicTarget = document.getElementById(select?.dataset.topicTarget || '');
    if (!topicTarget) return;

    const subjectId = Number(select.value);
    if (!subjectId) {
        resetTopicSelect(topicTarget);
        return;
    }

    topicTarget.disabled = true;
    topicTarget.innerHTML = '<option value="">Themen werden geladen...</option>';

    try {
        const topics = await loadTopicsForSubject(subjectId);
        topicTarget.innerHTML = '<option value="">Thema auswählen</option>';
        topics.forEach((topic) => {
            const option = document.createElement('option');
            option.value = topic.id;
            option.textContent = topic.title;
            topicTarget.append(option);
        });
        topicTarget.disabled = false;
    } catch (error) {
        console.error('Konnte Themen nicht laden:', error);
        topicTarget.innerHTML = '<option value="">Fehler beim Laden</option>';
    }
};

const setButtonLoading = (button, isLoading) => {
    if (!button) return;
    button.disabled = isLoading;
};

const handleFileUpload = async (event) => {
    event.preventDefault();
    const topicId = Number(fileTopicSelect?.value);
    const file = materialFileInput?.files?.[0];

    setStatusMessage(fileUploadMessage);

    if (!topicId) {
        setStatusMessage(fileUploadMessage, 'Bitte zuerst ein Thema auswählen.', 'error');
        return;
    }
    if (!file) {
        setStatusMessage(fileUploadMessage, 'Bitte eine Datei auswählen.', 'error');
        return;
    }

    setButtonLoading(fileUploadButton, true);
    try {
        await window.api.uploadFile(topicId, file);
        setStatusMessage(fileUploadMessage, 'Datei erfolgreich hochgeladen.', 'success');
        fileUploadForm?.reset();
        resetTopicSelect(fileTopicSelect);
    } catch (error) {
        console.error('Upload fehlgeschlagen:', error);
        setStatusMessage(fileUploadMessage, 'Fehler: ' + (error?.message || error), 'error');
    } finally {
        setButtonLoading(fileUploadButton, false);
    }
};

const handleTextBlockSubmit = async (event) => {
    event.preventDefault();
    const topicId = Number(textTopicSelect?.value);
    const title = textBlockTitle?.value?.trim();
    const text = textBlockContent?.value?.trim();
    const position = Number(textBlockPosition?.value) || 1;

    setStatusMessage(textBlockMessage);

    if (!topicId) {
        setStatusMessage(textBlockMessage, 'Bitte zuerst ein Thema auswählen.', 'error');
        return;
    }
    if (!title || !text) {
        setStatusMessage(textBlockMessage, 'Titel und Text dürfen nicht leer sein.', 'error');
        return;
    }

    setButtonLoading(textBlockButton, true);
    try {
        await window.api.createTextBlock(topicId, title, position, text);
        setStatusMessage(textBlockMessage, 'Textblock gespeichert.', 'success');
        textBlockForm?.reset();
        resetTopicSelect(textTopicSelect);
    } catch (error) {
        console.error('Textblock konnte nicht erstellt werden:', error);
        setStatusMessage(textBlockMessage, 'Fehler: ' + (error?.message || error), 'error');
    } finally {
        setButtonLoading(textBlockButton, false);
    }
};

const initUploadPanel = async () => {
    if (!uploadPanel) return;
    uploadPanel.classList.remove('hidden-block');

    try {
        const subjects = await loadSubjects();
        populateSubjectSelects(subjects);

        subjectSelects.forEach((select) => {
            select.addEventListener('change', (event) => handleSubjectChange(event.target));
        });

        fileUploadForm?.addEventListener('submit', handleFileUpload);
        textBlockForm?.addEventListener('submit', handleTextBlockSubmit);
    } catch (error) {
        uploadPanel.classList.add('hidden-block');
        console.error('Upload-Bereich konnte nicht initialisiert werden:', error);
        alert('Upload-Bereich konnte nicht geladen werden: ' + (error?.message || error));
    }
};

const init = () => {
    attachYearToggles();
    openSelectedYear();
    setHeading();
    renderList();

    if (filterInput) {
        filterInput.addEventListener('input', (event) => {
            renderList(event.target.value);
        });
    }

    if (!isLoggedIn) {
        showLoginGate();
    } else if (currentFile) {
        const current = materials.find(m => m.file === currentFile);
        showFile(current || null);
    } else {
        showFile(null);
    }

    if (canManageContent) {
        initUploadPanel();
    } else if (uploadPanel) {
        uploadPanel.classList.add('hidden-block');
    }

    if (typeof renderUserControls === 'function') {
        renderUserControls();
    }
};

init();

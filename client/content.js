(async () => {
const contentList = document.querySelector('#content-list');
const contentContainer = document.querySelector('#content-container');
const contextHeading = document.querySelector('#context-heading');
const chipYear = document.querySelector('#chip-year');
const chipSubject = document.querySelector('#chip-subject');
const dateiName = document.querySelector('#datei-name');
const downloadButton = document.querySelector('#download-button');
const fileViewer = document.querySelector('#file-viewer');
const emptyState = document.querySelector('#empty-state');
const filterInput = document.querySelector('#material-filter');

const url = new URL(location.href);
const selectedSubjectId = Number(url.searchParams.get('subjectId'));
const currentFile = Number(url.searchParams.get('file'));
const isLoggedIn = !!sessionStorage.getItem('token');
const userRole = sessionStorage.getItem('role');
const canManageContent = isLoggedIn && (userRole === 'ADMIN' || userRole === 'TEACHER');
const subjectListContainer = document.querySelector('[data-subject-list]');

const selectedSubject = await (async () => {
    const subjects = await api.getAllSubjects();
    return subjects.filter(s=>s.id === selectedSubjectId)[0];
})();
const selectedSubjectTopics = selectedSubject === undefined ? undefined : await Promise.all((await api.getTopicsForSubject(selectedSubject.id)).map(async topic => {
    const content = await api.getTopicContent(topic.id);
    topic.content = content;

    const files = await api.getFiles(topic.id);
    topic.files = files.map(f => {
        f.name = f.originalName;
        return f;
    });

    return topic;
}));

const uploadPanel = document.getElementById('upload-panel');
const fileUploadForm = document.getElementById('file-upload-form');
const fileTopicSelect = document.getElementById('file-topic-select');
const materialFileInput = document.getElementById('material-file');
const fileUploadMessage = document.getElementById('file-upload-message');
const subjectSelects = document.querySelectorAll('[data-subject-select]');
const fileUploadButton = fileUploadForm?.querySelector('button[type="submit"]');

const subjectHeadingLabel = () => {
    if (selectedSubject) return selectedSubject.name;
    return 'Alle Fächer';
};

const setHeading = () => {
    const subjectLabel = subjectHeadingLabel();
    const yearLabel = 'Jahr 5';
    const heading = selectedSubject ? `${yearLabel} - ${subjectLabel}` : 'Materialübersicht';
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
    closeAllYearSubjects();
    const targetItem = document.querySelector(`#sidebar-menu .year-item[data-year="5"]`);
    if (targetItem) {
        const subjects = targetItem.querySelector('.year-subjects');
        if (subjects) subjects.classList.remove('hidden');
        if (selectedSubject) {
            document.querySelectorAll('#sidebar-menu .year-subjects a').forEach(link => link.classList.remove('active'));
            const activeLink = targetItem.querySelector(`.year-subjects a[href*="fach=${selectedSubject}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    }
};

document.addEventListener('click', (event) => {
    const clickedInsideYearList = event.target.closest('#sidebar .year-item');
    if (!clickedInsideYearList) {
        closeAllYearSubjects();
    }
});

// --- Dynamic subject navigation ---

const subjectNavMessage = (message) => {
    if (!subjectListContainer) return;
    subjectListContainer.innerHTML = `<li class="nav-placeholder"></li>`;
    subjectListContainer.firstElementChild.innerText = message;
};

const buildSubjectLink = (subject) => {
    const params = new URLSearchParams();
    params.set('subjectId', subject.id);
    params.set('subjectName', subject.name);
    params.set('fach', subject.name);
    return `content.html?${params.toString()}`;
};

const renderSidebarSubjects = (subjects) => {
    if (!subjectListContainer) return;
    if (!subjects.length) {
        subjectNavMessage('Noch keine Fächer verfügbar.');
        return;
    }

    subjectListContainer.innerHTML = '';
    const activeSubjectId = selectedSubjectId ? Number(selectedSubjectId) : null;

    subjects.forEach((subject) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = buildSubjectLink(subject);
        link.textContent = subject.name;
        if (activeSubjectId && subject.id === activeSubjectId) {
            link.classList.add('active');
        }
        li.append(link);
        subjectListContainer.append(li);
    });
};

const initSidebarSubjects = async () => {
    if (!subjectListContainer) return;
    if (!isLoggedIn) {
        subjectNavMessage('Bitte zuerst anmelden.');
        return;
    }

    try {
        const subjects = await loadSubjects();
        renderSidebarSubjects(subjects);
    } catch (error) {
        console.error('Fächer konnten nicht geladen werden:', error);
        subjectNavMessage('Fächer konnten nicht geladen werden.');
    }
};

// --- Materialliste & Detailansicht ---

const updateUrl = (fileId) => {
    const linkUrl = new URL(location.href);
    if (fileId) linkUrl.searchParams.set('file', fileId);
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
        fileViewer.src = 'about:blank';
        dateiName.textContent = 'Bitte wählen Sie eine Datei';
        updateUrl(null);
        return;
    }

    emptyState.classList.add('hidden-block');
    dateiName.textContent = material.name;
    api.getObjectUrlForFile(material.id).then(url => fileViewer.src = url);
    contentContainer.classList.remove('hidden-block');
    updateUrl(material.id);
};

const downloadFile = () => {
    if (!['http', 'https', 'blob'].includes(fileViewer.src.split(':')[0])) return;
    const dlLink = document.createElement('a');
    dlLink.href = fileViewer.src;
    dlLink.download = dateiName.textContent;
    dlLink.click();
}
downloadButton.addEventListener('click', downloadFile);

const renderList = (filterText = '') => {
    contentList.innerHTML = '';
    const query = filterText.trim().toLowerCase();
    const filtered = selectedSubjectTopics?.map(t => t.files).flat().filter(item => query ? item.name.toLowerCase().includes(query) : true) ?? [];

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

        const linkTitle = document.createElement('div');
        linkTitle.classList.add('material-title');
        linkTitle.innerText = item.name;

        const linkMeta = document.createElement('div');
        linkMeta.classList.add('material-meta')
        linkMeta.innerText = selectedSubjectTopics.find(t => t.id === item.topicId).title;

        const linkSubContainer = document.createElement('div');
        linkSubContainer.append(linkTitle, linkMeta);

        link.append(linkSubContainer);
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
    cachedSubjects = await api.getAllSubjects();
    return cachedSubjects;
};

const loadTopicsForSubject = async (subjectId) => {
    if (!subjectId) return [];
    if (topicCache.has(subjectId)) return topicCache.get(subjectId);
    const topics = await api.getTopicsForSubject(subjectId);
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
        await api.uploadFile(topicId, file);
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
    initSidebarSubjects();
    renderList();

    if (filterInput) {
        filterInput.addEventListener('input', (event) => {
            renderList(event.target.value);
        });
    }

    if (!isLoggedIn) {
        showLoginGate();
    } else if (currentFile) {
        const current = selectedSubjectTopics?.flatMap(t => t.files).find(f => f.id === currentFile);
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
})()
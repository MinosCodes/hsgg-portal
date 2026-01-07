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
const currentFile = !url.searchParams.get('file') ? undefined : splitPostId(url.searchParams.get('file'));
const isLoggedIn = !!localStorage.getItem('token');
const userRole = localStorage.getItem('role');
const canManageContent = isLoggedIn && (userRole === 'ADMIN' || userRole === 'TEACHER');
const subjectListContainer = document.querySelector('[data-subject-list]');

const selectedSubject = await (async () => {
    const subjects = await api.getAllSubjects();
    return subjects.filter(s=>s.id === selectedSubjectId)[0];
})();
const selectedSubjectTopics = selectedSubject === undefined ? undefined : await Promise.all(
    (await api.getTopicsForSubject(selectedSubject.id))
    .sort((a,b) => a.title > b.title)
    .map(async topic => {
        const posts = await getAllPostsForTopic(topic.id);
        topic.posts = posts;
        return topic;
    })
);
const selectedSubjectFiles = selectedSubject === undefined ? undefined : (
    (await Promise.all(selectedSubjectTopics.map(t => api.getFiles(t.id))))
    .flat()
    .map(f => {
        f.name = f.originalName;
        return f;
    }).reduce((a, c) => {
        a[c.id] = c;
        return a;
    }, {})
);

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

const showFile = (material, solution = false) => {
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
    dateiName.textContent = material.content[POST_TITLE_KEY];

    const fileId = material.content[solution ? POST_SOLUTION_FILE_ID_KEY : POST_CONTENT_FILE_ID_KEY];
    api.getObjectUrlForFile(fileId).then(url => {
        fileViewer.dataset.filename = selectedSubjectFiles[fileId].name;
        fileViewer.src = url
    });
    contentContainer.classList.remove('hidden-block');
    updateUrl(material.id);
};

const downloadFile = () => {
    if (!['http', 'https', 'blob'].includes(fileViewer.src.split(':')[0])) return;
    const dlLink = document.createElement('a');
    dlLink.href = fileViewer.src;
    dlLink.download = fileViewer.dataset.filename;
    dlLink.click();
}
downloadButton.addEventListener('click', downloadFile);

const renderList = (filterText = '') => {
    contentList.innerHTML = '';
    const query = filterText.trim().toLowerCase();
    const filtered = selectedSubjectTopics?.flatMap(t => t.posts).filter(item => query ? item.content.title.toLowerCase().includes(query) : true) ?? [];

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
        linkTitle.innerText = item.content.title;

        const linkMeta = document.createElement('div');
        linkMeta.classList.add('material-meta')
        linkMeta.innerText = selectedSubjectTopics.find(t => t.id === splitPostId(item.id).topicId).title;

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

let cachedSubjects = [];

const loadSubjects = async () => {
    if (cachedSubjects.length) return cachedSubjects;
    cachedSubjects = await api.getAllSubjects();
    return cachedSubjects;
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
        const current = selectedSubjectTopics?.find(t => t.id === currentFile.topicId)?.posts.find(p => p.id === currentFile.blockId);
        showFile(current || null);
    } else {
        showFile(null);
    }

    if (typeof renderUserControls === 'function') {
        renderUserControls();
    }
};

init();
})()
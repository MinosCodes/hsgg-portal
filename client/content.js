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
    { name: 'Arbeitsblatt Grammatik', file: 'bspl1.pdf', year: '5', subject: 'deutsch', type: 'PDF' },
    { name: 'Lektüre-Auszug', file: 'bspl2.pdf', year: '6', subject: 'deutsch', type: 'PDF' },
    { name: 'Mathe Übungsset Brüche', file: 'bspl3.pdf', year: '6', subject: 'mathematik', type: 'PDF' },
    { name: 'Biologie: Zellaufbau', file: 'bspl4.pdf', year: '7', subject: 'biologie', type: 'PDF' },
    { name: 'Physik Versuchsanleitung', file: 'bspl5.pdf', year: '8', subject: 'physik', type: 'PDF' },
    { name: 'Chemie Reaktionsgleichungen', file: 'bspl6.pdf', year: '9', subject: 'chemie', type: 'PDF' },
    { name: 'Politik: Demokratietheorie', file: 'bspl7.pdf', year: '9', subject: 'politik', type: 'PDF' },
    { name: 'Informatik: Algorithmen Basics', file: 'bspl8.pdf', year: '10', subject: 'informatik', type: 'PDF' },
];

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

attachYearToggles();
openSelectedYear();
setHeading();
renderList();

if (filterInput) {
    filterInput.addEventListener('input', (event) => {
        renderList(event.target.value);
    });
}

if (currentFile) {
    const current = materials.find(m => m.file === currentFile);
    showFile(current || null);
} else {
    showFile(null);
}

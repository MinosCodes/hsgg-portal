const contentList = document.querySelector('#content-list');
const contentContainer = document.querySelector('#content-container');
const contextHeading = document.querySelector('#context-heading');

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

const formatSubjectLabel = (value) => {
    if (!value) return '';
    const normalized = value.toLowerCase();
    if (subjectLabels[normalized]) {
        return subjectLabels[normalized];
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
};

// Show which year and subject were chosen
if (selectedYear && selectedSubject && contextHeading) {
    const subjectLabel = formatSubjectLabel(selectedSubject);
    contextHeading.innerText = 'Jahr ' + selectedYear + ' – ' + subjectLabel;
}

const closeAllYearSubjects = () => {
    document.querySelectorAll('#sidebar-menu .year-subjects').forEach(list => {
        list.classList.add('hidden');
    });
};

const attachYearToggles = () => {
    document.querySelectorAll('#sidebar-menu .year-link').forEach(link => {
        link.addEventListener('click', (event) => {
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

attachYearToggles();

if (selectedYear) {
    closeAllYearSubjects();
    const targetItem = document.querySelector(`#sidebar-menu .year-item[data-year="${selectedYear}"]`);
    if (targetItem) {
        const subjects = targetItem.querySelector('.year-subjects');
        if (subjects) {
            subjects.classList.remove('hidden');
        }
        if (selectedSubject) {
            document.querySelectorAll('#sidebar-menu .year-subjects a').forEach(link => link.classList.remove('active'));
            const activeLink = targetItem.querySelector(`.year-subjects a[href*="fach=${selectedSubject}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
} else {
    closeAllYearSubjects();
}

document.addEventListener('click', (event) => {
    const clickedInsideYearList = event.target.closest('#sidebar .year-item');
    if (!clickedInsideYearList) {
        closeAllYearSubjects();
    }
});

const listOfContent = [];
// Only generate some example data for now - should at some point be requested from an API
for (let i = 1; i <= 10; i++) {
    listOfContent.push({
        name: 'Beispiel ' + i,
        file: 'bspl' + i + '.pdf'
    });
}

// Add everything from listOfContent to the Web Page
for (const fileData of listOfContent) {
    const elem = document.createElement('li');
    const link = document.createElement('a');
    link.innerText = fileData.name;

    const linkUrl = new URL(location.href);
    if (selectedYear) {
        linkUrl.searchParams.set('jahr', selectedYear);
    }
    if (selectedSubject) {
        linkUrl.searchParams.set('fach', selectedSubject);
    }
    linkUrl.searchParams.set('file', fileData.file);
    link.href = linkUrl.href;

    elem.append(link);
    contentList.append(elem);
}

// Show currently selected file
if (currentFile) {
    const currentFileData = listOfContent.filter(v => v.file === currentFile)[0];
    const dateiName = document.querySelector('#datei-name');
    dateiName.innerText = currentFileData ? currentFileData.name : currentFile;

    document.querySelector('#download-link').href = 'content/' + currentFile;
    document.querySelector('#file-viewer').src = 'content/' + currentFile;

    document.querySelector('#content-container').classList.remove('invisible');
}

const toggleButton = document.getElementById('sidebar-toggle-button');
const sidebar = document.getElementById('sidebar');

const setInitialSidebarState = () => {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('hidden');
        toggleButton.classList.remove('active');
    } else {
        sidebar.classList.remove('hidden');
        toggleButton.classList.remove('active');
    }
};

setInitialSidebarState();
window.addEventListener('resize', setInitialSidebarState);

toggleButton.addEventListener('click', () => {
    toggleButton.classList.toggle('active');
    sidebar.classList.toggle('hidden');
});

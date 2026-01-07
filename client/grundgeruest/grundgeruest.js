const toggleButton = document.getElementById('sidebar-toggle-button');
const sidebar = document.getElementById('sidebar');
const subjectList = document.querySelector('[data-subject-list]');

// Ensure sensible initial state depending on viewport width
const setInitialSidebarState = () => {
    if (window.innerWidth <= 768) {
        // On small screens, keep sidebar hidden by default
        sidebar.classList.add('hidden');
    } else {
        // On larger screens, show sidebar in its normal position
        sidebar.classList.remove('hidden');
    }
};

setInitialSidebarState();
window.addEventListener('resize', setInitialSidebarState);

toggleButton.addEventListener('click', () => {
    toggleButton.classList.toggle('active');
    sidebar.classList.toggle('hidden');
});

const closeAllYearSubjects = () => {
    document.querySelectorAll('#sidebar-menu .year-subjects').forEach(list => {
        list.classList.add('hidden');
    });
};

// Toggle subjects for each year (accordion style)
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

document.addEventListener('click', (event) => {
    const clickedInsideYearList = event.target.closest('#sidebar .year-item');
    if (!clickedInsideYearList) {
        closeAllYearSubjects();
    }
});

const setSidebarMessage = (message) => {
    if (!subjectList) return;
    subjectList.innerHTML = `<li class="nav-placeholder">${message}</li>`;
};

const buildContentLink = (subject) => {
    const params = new URLSearchParams();
    params.set('jahr', '5');
    params.set('subjectId', subject.id);
    params.set('subjectName', subject.name);
    params.set('fach', subject.name);
    return `../content.html?${params.toString()}`;
};

const renderSidebarSubjects = (subjects) => {
    if (!subjectList) return;
    if (!subjects.length) {
        setSidebarMessage('Noch keine Fächer verfügbar.');
        return;
    }

    subjectList.innerHTML = '';
    subjects.forEach((subject) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = buildContentLink(subject);
        link.textContent = subject.name;
        li.append(link);
        subjectList.append(li);
    });
};

const initSubjects = async () => {
    if (!subjectList) return;
    if (!localStorage.getItem('token')) {
        setSidebarMessage('Bitte zuerst anmelden.');
        return;
    }

    try {
        const subjects = await api.getAllSubjects();
        renderSidebarSubjects(subjects);
    } catch (error) {
        console.error('Fächer konnten nicht geladen werden:', error);
        setSidebarMessage('Fächer konnten nicht geladen werden.');
    }
};

document.addEventListener('DOMContentLoaded', initSubjects);

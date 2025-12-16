const toggleButton    = document.getElementById('sidebar-toggle-button');   // Header-Button
const sidebar         = document.getElementById('sidebar');
const rolePanels      = document.getElementById('role-panels');
const adminCard       = document.getElementById('admin-card');
const teacherCard     = document.getElementById('teacher-card');
const subjectList     = document.querySelector('[data-subject-list]');
const quickLinks      = document.querySelector('[data-subject-quicklinks]');
const SUBJECT_CARD_LIMIT = 6;


const setInitialSidebarState = () => {
    if (window.innerWidth <= 768) {
        // Mobil: Sidebar standardmäßig eingeklappt (Overlay)
        sidebar.classList.add('hidden');
        sidebar.classList.remove('show');
    } else {
        // Desktop: Sidebar standardmäßig ausgeklappt und schiebt Inhalt
        sidebar.classList.add('show');
        sidebar.classList.remove('hidden');
    }
};

setInitialSidebarState();
window.addEventListener('resize', setInitialSidebarState);

// Button im Overlay
toggleButton.addEventListener('click', () => {
    if(sidebar.classList.contains('show')){
        toggleButton.classList.toggle('active');
        sidebar.classList.add('hidden');
        sidebar.classList.remove('show');
    } else {
        toggleButton.classList.toggle('active');
        sidebar.classList.add('show');
        sidebar.classList.remove('hidden');
    }
});


// --- Jahrgangs-Fächer-Accordion ---

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

// Klick außerhalb der Jahrgangsliste schließt Unterlisten
document.addEventListener('click', (event) => {
    const clickedInsideYearList = event.target.closest('#sidebar .year-item');
    if (!clickedInsideYearList) {
        closeAllYearSubjects();
    }
});

// --- Dynamic subjects ---

const buildContentLink = (subject) => {
    const params = new URLSearchParams();
    params.set('jahr', '5');
    params.set('subjectId', subject.id);
    params.set('subjectName', subject.name);
    params.set('fach', subject.name);
    return `content.html?${params.toString()}`;
};

const setSidebarMessage = (message) => {
    if (!subjectList) return;
    subjectList.innerHTML = `<li class="nav-placeholder">${message}</li>`;
};

const setQuickLinksMessage = (message) => {
    if (!quickLinks) return;
    quickLinks.innerHTML = `<p class="nav-placeholder">${message}</p>`;
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

const renderQuickLinks = (subjects) => {
    if (!quickLinks) return;
    if (!subjects.length) {
        setQuickLinksMessage('Noch keine Fächer verfügbar.');
        return;
    }

    quickLinks.innerHTML = '';
    subjects.slice(0, SUBJECT_CARD_LIMIT).forEach((subject) => {
        const card = document.createElement('a');
        card.className = 'year-card';
        card.role = 'listitem';
        card.dataset.year = '5';
        card.href = buildContentLink(subject);
        card.innerHTML = `
            <span class="year">Jahr 5</span>
            <span class="desc">${subject.name}</span>
        `;
        quickLinks.append(card);
    });
};

const initSubjects = async () => {
    if (!subjectList && !quickLinks) return;
    if (!sessionStorage.getItem('token')) {
        setSidebarMessage('Bitte zuerst anmelden.');
        setQuickLinksMessage('Bitte zuerst anmelden.');
        return;
    }

    try {
        const subjects = await window.api.getSubjects();
        renderSidebarSubjects(subjects);
        renderQuickLinks(subjects);
    } catch (error) {
        console.error('Fächer konnten nicht geladen werden:', error);
        setSidebarMessage('Fächer konnten nicht geladen werden.');
        setQuickLinksMessage('Fächer konnten nicht geladen werden.');
    }
};

// --- Role-based quick links ---
const showRolePanels = () => {
    const role = sessionStorage.getItem('role');
    let anyVisible = false;
    if (role === 'ADMIN') {
        adminCard?.removeAttribute('hidden');
        teacherCard?.setAttribute('hidden', '');
        anyVisible = true;
    } else if (role === 'TEACHER') {
        teacherCard?.removeAttribute('hidden');
        adminCard?.setAttribute('hidden', '');
        anyVisible = true;
    } else {
        adminCard?.setAttribute('hidden', '');
        teacherCard?.setAttribute('hidden', '');
    }

    if (anyVisible) {
        rolePanels?.removeAttribute('hidden');
    } else {
        rolePanels?.setAttribute('hidden', '');
    }
};

const initLogoCardShortcut = () => {
    const logoCard = document.querySelector('.logo-card[data-scroll-target]');
    if (!logoCard) return;

    const targetSelector = logoCard.getAttribute('data-scroll-target');
    if (!targetSelector) return;

    const targetSection = document.querySelector(targetSelector);
    if (!targetSection) return;

    const scrollToTarget = () => targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    logoCard.addEventListener('click', scrollToTarget);
    logoCard.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            scrollToTarget();
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    showRolePanels();
    initLogoCardShortcut();
    initSubjects();
    if (typeof renderUserControls === 'function') {
        renderUserControls();
    }
});

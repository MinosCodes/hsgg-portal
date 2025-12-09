const toggleButton    = document.getElementById('sidebar-toggle-button');   // Header-Button
const sidebar         = document.getElementById('sidebar');
const rolePanels      = document.getElementById('role-panels');
const adminCard       = document.getElementById('admin-card');
const teacherCard     = document.getElementById('teacher-card');


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

document.addEventListener('DOMContentLoaded', showRolePanels);

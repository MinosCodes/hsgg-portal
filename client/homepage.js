const toggleButton = document.getElementById('sidebar-toggle-button');
const sidebar = document.getElementById('sidebar');

const setInitialSidebarState = () => {
    if (window.innerWidth <= 768) {
        // Mobil: Sidebar standardmäßig eingeklappt (Overlay)
        sidebar.classList.add('hidden');
        sidebar.classList.remove('show');
        toggleButton.classList.remove('active');
        document.body.classList.remove('nav-open'); // NEU
    } else {
        // Desktop: Sidebar standardmäßig ausgeklappt und schiebt Inhalt
        sidebar.classList.add('show');
        sidebar.classList.remove('hidden');
        toggleButton.classList.remove('active');
        document.body.classList.remove('nav-open'); // NEU
    }
};

setInitialSidebarState();
window.addEventListener('resize', setInitialSidebarState);

// Sidebar ein-/ausklappen
toggleButton.addEventListener('click', () => {
    toggleButton.classList.toggle('active');
    sidebar.classList.toggle('show');
    sidebar.classList.toggle('hidden');
    document.body.classList.toggle('nav-open'); // NEU: steuert Button-Position
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

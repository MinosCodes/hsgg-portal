const toggleButton    = document.getElementById('sidebar-toggle-button');   // Header-Button
const sidebar         = document.getElementById('sidebar');
const closeOverlay    = document.getElementById('sidebar-close-overlay');   // Wrapper für Navbar-Button
const closeButton     = document.getElementById('sidebar-close-button');    // Navbar-Button

const setInitialSidebarState = () => {
    if (window.innerWidth <= 768) {
        // Mobil: Sidebar standardmäßig eingeklappt (Overlay)
        sidebar.classList.add('hidden');
        sidebar.classList.remove('show');
        toggleButton.style.display = 'block';
        closeOverlay.style.display = 'none';
    } else {
        // Desktop: Sidebar standardmäßig ausgeklappt und schiebt Inhalt
        sidebar.classList.add('show');
        sidebar.classList.remove('hidden');
        toggleButton.style.display = 'none';
        closeOverlay.style.display = 'block';
    }
};

setInitialSidebarState();
window.addEventListener('resize', setInitialSidebarState);

// Button A im Header: Sidebar öffnen
toggleButton.addEventListener('click', () => {
    sidebar.classList.add('show');
    sidebar.classList.remove('hidden');
    toggleButton.style.display = 'none';
    closeOverlay.style.display = 'block';
});

// Button B in Navbar: Sidebar schließen
closeButton.addEventListener('click', () => {
    sidebar.classList.add('hidden');
    sidebar.classList.remove('show');
    toggleButton.style.display = 'block';
    closeOverlay.style.display = 'none';
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

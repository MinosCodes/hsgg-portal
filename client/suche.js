// Sidebar-Toggle-Funktionalität (wie auf anderen Seiten)
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-button');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-search');
    const resultsContainer = document.getElementById('results-container');
    const resultsInfo = document.getElementById('results-info');

    // Sidebar Toggle
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('show');
        });
    }

    // Year-Items Toggle (Dropdown in Sidebar)
    document.querySelectorAll('.year-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                const parent = link.closest('.year-item');
                const subjects = parent.querySelector('.year-subjects');
                if (subjects) {
                    subjects.classList.toggle('hidden');
                }
            }
        });
    });

    // Suchbegriff aus URL-Parameter laden
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
        searchInput.value = queryParam;
        performSearch(queryParam);
    }

    // Suche ausführen bei Button-Klick
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
            // URL aktualisieren
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('q', query);
            window.history.pushState({}, '', newUrl);
        }
    });

    // Suche bei Enter-Taste
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('q', query);
                window.history.pushState({}, '', newUrl);
            }
        }
    });

    // Löschen-Button anzeigen/verstecken
    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            clearButton.style.display = 'flex';
        } else {
            clearButton.style.display = 'none';
        }
    });

    // Suche zurücksetzen
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        resultsContainer.innerHTML = '';
        resultsInfo.innerHTML = '';
        searchInput.focus();
        // URL zurücksetzen
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('q');
        window.history.pushState({}, '', newUrl);
    });

    // Hauptsuchfunktion
    async function performSearch(query) {
        // Lade-Animation anzeigen
        resultsContainer.innerHTML = '<div class="loading">Suche läuft...</div>';
        resultsInfo.innerHTML = '';

        try {
            // API-Aufruf zum Abrufen aller Materialien
            const materials = await searchMaterials(query);

            if (materials.length === 0) {
                displayNoResults(query);
            } else {
                displayResults(materials, query);
            }
        } catch (error) {
            console.error('Fehler bei der Suche:', error);
            resultsContainer.innerHTML = '<div class="no-results"><h2>Fehler</h2><p>Bei der Suche ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.</p></div>';
        }
    }

    // Suchlogik - durchsucht alle Materialien
    async function searchMaterials(query) {
        const results = [];
        const queryLower = query.toLowerCase();

        // Alle möglichen Jahr/Fach-Kombinationen durchsuchen
        const years = [5, 6, 7, 8, 9, 10];
        const subjects = {
            5: ['deutsch', 'mathematik', 'englisch', 'biologie'],
            6: ['deutsch', 'mathematik', 'englisch', 'franzoesisch', 'latein', 'biologie', 'physik'],
            7: ['deutsch', 'mathematik', 'franzoesisch', 'latein', 'biologie', 'chemie', 'physik', 'politik', 'informatik'],
            8: ['deutsch', 'mathematik', 'franzoesisch', 'latein', 'biologie', 'chemie', 'physik', 'politik', 'informatik'],
            9: ['deutsch', 'mathematik', 'franzoesisch', 'latein', 'biologie', 'chemie', 'physik', 'politik', 'informatik'],
            10: ['deutsch', 'mathematik', 'franzoesisch', 'latein', 'biologie', 'chemie', 'physik', 'politik', 'informatik']
        };

        // Fach-Namen-Mapping für bessere Anzeige
        const subjectNames = {
            'deutsch': 'Deutsch',
            'mathematik': 'Mathematik',
            'englisch': 'Englisch',
            'franzoesisch': 'Französisch',
            'latein': 'Latein',
            'biologie': 'Biologie',
            'chemie': 'Chemie',
            'physik': 'Physik',
            'politik': 'Politik',
            'informatik': 'Informatik'
        };

        for (const year of years) {
            for (const subject of subjects[year]) {
                try {
                    // API-Aufruf für jede Kombination
                    const response = await fetch(`/api/material?jahr=${year}&fach=${subject}`);
                    if (response.ok) {
                        const data = await response.json();

                        // Jedes Material prüfen
                        if (data.materials && Array.isArray(data.materials)) {
                            data.materials.forEach(material => {
                                // Suche in: Titel, Beschreibung, Fach, Inhalt
                                const titleMatch = material.title?.toLowerCase().includes(queryLower);
                                const descMatch = material.description?.toLowerCase().includes(queryLower);
                                const subjectMatch = subject.toLowerCase().includes(queryLower) ||
                                    subjectNames[subject].toLowerCase().includes(queryLower);
                                const contentMatch = material.content?.toLowerCase().includes(queryLower);

                                if (titleMatch || descMatch || subjectMatch || contentMatch) {
                                    results.push({
                                        id: material.id,
                                        title: material.title || 'Ohne Titel',
                                        description: material.description || 'Keine Beschreibung verfügbar',
                                        year: year,
                                        subject: subject,
                                        subjectName: subjectNames[subject],
                                        url: `content.html?jahr=${year}&fach=${subject}#material-${material.id}`
                                    });
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error(`Fehler beim Abrufen von Jahr ${year}, Fach ${subject}:`, error);
                }
            }
        }

        return results;
    }

    // Ergebnisse anzeigen
    function displayResults(results, query) {
        resultsInfo.innerHTML = `<strong>${results.length}</strong> Ergebnis${results.length !== 1 ? 'se' : ''} für "<strong>${escapeHtml(query)}</strong>"`;

        resultsContainer.innerHTML = '';

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.onclick = () => {
                window.location.href = result.url;
            };

            resultItem.innerHTML = `
                <h3>${escapeHtml(result.title)}</h3>
                <div class="search-result-meta">
                    <span class="meta-badge meta-year">Jahr ${result.year}</span>
                    <span class="meta-badge meta-subject">${escapeHtml(result.subjectName)}</span>
                </div>
                <p class="search-result-description">${escapeHtml(result.description)}</p>
            `;

            resultsContainer.appendChild(resultItem);
        });
    }

    // Keine Ergebnisse anzeigen
    function displayNoResults(query) {
        resultsInfo.innerHTML = `<strong>0</strong> Ergebnisse für "<strong>${escapeHtml(query)}</strong>"`;
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h2>Keine Ergebnisse gefunden</h2>
                <p>Ihre Suche nach "<strong>${escapeHtml(query)}</strong>" ergab keine Treffer.</p>
                <p>Versuchen Sie es mit anderen Suchbegriffen oder einer allgemeineren Suche.</p>
            </div>
        `;
    }

    // HTML escapen für Sicherheit
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
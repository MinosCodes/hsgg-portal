const subjectListContainer = document.querySelector('[data-subject-list]');

const subjectNavMessage = (message) => {
    if (!subjectListContainer) return;
    subjectListContainer.innerHTML = `<li class="nav-placeholder">${message}</li>`;
};

const buildSubjectLink = (subject) => {
    const params = new URLSearchParams();
    params.set('jahr', '5');
    params.set('subjectId', subject.id);
    params.set('subjectName', subject.name);
    params.set('fach', subject.name);
    return `content.html?${params.toString()}`;
};

const renderSidebarSubjects = (subjects) => {
    if (!subjectListContainer) return;
    if (!subjects || subjects.length === 0) {
        subjectNavMessage('Noch keine Fächer verfügbar.');
        return;
    }

    subjectListContainer.innerHTML = '';
    subjects.forEach((subject) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = buildSubjectLink(subject);
        link.textContent = subject.name;
        listItem.appendChild(link);
        subjectListContainer.appendChild(listItem);
    });
};

const initSidebarSubjects = async () => {
    if (!subjectListContainer) return;
    const token = sessionStorage.getItem('token');
    if (!token) {
        subjectNavMessage('Bitte zuerst anmelden.');
        return;
    }

    try {
        const subjects = await api.getSubjects();
        renderSidebarSubjects(subjects);
    } catch (error) {
        console.error('Fächer konnten nicht geladen werden:', error);
        subjectNavMessage('Fächer konnten nicht geladen werden.');
    }
};

// Sidebar-Toggle-Funktionalität (wie auf anderen Seiten)
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-search');
    const resultsContainer = document.getElementById('results-container');
    const resultsInfo = document.getElementById('results-info');

    initSidebarSubjects();

    const toggleButton = document.getElementById('sidebar-toggle-button');
    const sidebar = document.getElementById('sidebar');

    // Sidebar Toggle
    toggleButton.addEventListener('click', () => {
        toggleButton.classList.toggle('active');
        sidebar.classList.toggle('hidden');
    });

    // Year-Items Toggle (Dropdown in Sidebar)
    document.querySelectorAll('.year-link').forEach(link => {
        const parent = link.closest('.year-item');
        if (parent && parent.classList.contains('home-item')) {
            return;
        }
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
        clearButton.style.display = 'flex';
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
            // Prüfen ob User eingeloggt ist
            const token = sessionStorage.getItem('token');
            if (!token) {
                displayLoginPrompt(query);
                return;
            }

            // API-Aufruf über api.search()
            const searchResults = await api.search(query);

            console.log('Suchergebnisse:', searchResults); // Zum Debuggen

            if (!searchResults || searchResults.length === 0) {
                displayNoResults(query);
            } else {
                displayResults(searchResults, query);
            }
        } catch (error) {
            console.error('Fehler bei der Suche:', error);

            // Prüfen ob es ein Authentifizierungsfehler ist
            if (error.message.includes('Not Logged In') || error.message.includes('401')) {
                displayLoginPrompt(query);
            } else {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <h2>Fehler bei der Suche</h2>
                        <p>${escapeHtml(error.message)}</p>
                        <p>Bitte versuchen Sie es später erneut.</p>
                    </div>
                `;
            }
        }
    }

    // Ergebnisse anzeigen
    function displayResults(results, query) {
        resultsInfo.innerHTML = `<strong>${results.length}</strong> Ergebnis${results.length !== 1 ? 'se' : ''} für "<strong>${escapeHtml(query)}</strong>"`;

        resultsContainer.innerHTML = '';

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';

            // URL für das Ergebnis generieren
            const resultUrl = generateResultUrl(result);

            resultItem.onclick = () => {
                window.location.href = resultUrl;
            };

            // Titel extrahieren
            const title = result.title || result.name || 'Ohne Titel';

            // Beschreibung extrahieren
            const description = result.description || result.text || result.content || 'Keine Beschreibung verfügbar';

            // Fach und Jahr extrahieren
            const subjectInfo = extractSubjectInfo(result);
            const yearInfo = extractYearInfo(result);

            // HTML für das Ergebnis erstellen
            let metaHtml = '<div class="search-result-meta">';
            if (yearInfo) {
                metaHtml += `<span class="meta-badge meta-year">${escapeHtml(yearInfo)}</span>`;
            }
            if (subjectInfo) {
                metaHtml += `<span class="meta-badge meta-subject">${escapeHtml(subjectInfo)}</span>`;
            }
            metaHtml += '</div>';

            resultItem.innerHTML = `
                <h3>${escapeHtml(title)}</h3>
                ${metaHtml}
                <p class="search-result-description">${escapeHtml(truncate(description, 200))}</p>
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

    // Login-Prompt anzeigen
    function displayLoginPrompt(query) {
        resultsInfo.innerHTML = `Suche nach "<strong>${escapeHtml(query)}</strong>"`;
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h2>Anmeldung erforderlich</h2>
                <p>Um die Suchfunktion nutzen zu können, müssen Sie angemeldet sein.</p>
                <p style="margin-top: 1.5em;">
                    <a href="login.html" class="search-btn">Zum Login</a>
                </p>
            </div>
        `;
    }

    // Hilfsfunktionen

    // URL für Ergebnis generieren
    function generateResultUrl(result) {
        // Wenn das Ergebnis eine URL hat, diese verwenden
        if (result.url) return result.url;
        if (result.link) return result.link;

        // Wenn es eine topicId gibt, zur Topic-Seite verlinken
        if (result.topicId) {
            return `content.html?topicId=${result.topicId}`;
        }

        // Wenn es eine subjectId gibt
        if (result.subjectId) {
            return `content.html?subjectId=${result.subjectId}`;
        }

        // Fallback zur allgemeinen Content-Seite
        return 'content.html';
    }

    // Fach-Information extrahieren
    function extractSubjectInfo(result) {
        if (result.subject) return result.subject;
        if (result.subjectName) return result.subjectName;
        if (result.subject_name) return result.subject_name;

        // Fach-Namen-Mapping
        const subjectMap = {
            'deutsch': 'Deutsch',
            'mathematik': 'Mathematik',
            'mathe': 'Mathematik',
            'englisch': 'Englisch',
            'französisch': 'Französisch',
            'franzoesisch': 'Französisch',
            'latein': 'Latein',
            'biologie': 'Biologie',
            'bio': 'Biologie',
            'chemie': 'Chemie',
            'physik': 'Physik',
            'politik': 'Politik',
            'informatik': 'Informatik'
        };

        // Versuchen, Fach aus Titel oder Beschreibung zu extrahieren
        const text = ((result.title || '') + ' ' + (result.description || '')).toLowerCase();
        for (const [key, value] of Object.entries(subjectMap)) {
            if (text.includes(key)) return value;
        }

        return null;
    }

    // Jahr-Information extrahieren
    function extractYearInfo(result) {
        if (result.year) return `Jahr ${result.year}`;
        if (result.grade) return `Jahr ${result.grade}`;
        if (result.class) return `Klasse ${result.class}`;

        // Versuchen, Jahr aus Titel oder Beschreibung zu extrahieren
        const text = (result.title || '') + ' ' + (result.description || '');
        const yearMatch = text.match(/Jahr\s*(\d+)/i);
        if (yearMatch) return `Jahr ${yearMatch[1]}`;

        const gradeMatch = text.match(/Klasse\s*(\d+)/i);
        if (gradeMatch) return `Klasse ${gradeMatch[1]}`;

        return null;
    }

    // Text kürzen
    function truncate(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // HTML escapen für Sicherheit
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});



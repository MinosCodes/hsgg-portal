(function() {
  const roleLabels = {
    ADMIN: 'Administrator',
    TEACHER: 'Lehrkraft',
    STUDENT: 'Schüler/in'
  };

  const roleOptions = ['ADMIN', 'TEACHER', 'STUDENT'];

  const ensureAdmin = () => {
    const role = sessionStorage.getItem('role');
    if (role !== 'ADMIN') {
      alert('Nur für Administratoren. Bitte als Admin einloggen.');
      window.location.href = 'login.html';
      return false;
    }
    return true;
  };

  const tableBody = document.getElementById('admin-user-table-body');
  const roleFilter = document.getElementById('role-filter');
  const searchInput = document.getElementById('user-search');
  const createForm = document.getElementById('create-user-form');
  const createMsg = document.getElementById('create-user-message');

  let users = [];

  const badgeClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'role-admin';
      case 'TEACHER': return 'role-editor';
      default: return 'role-user';
    }
  };

  const render = () => {
    if (!tableBody) return;
    const filter = roleFilter?.value || 'all';
    const query = (searchInput?.value || '').trim().toLowerCase();

    tableBody.innerHTML = '';
    users
      .filter(u => filter === 'all' || u.role === filter)
      .filter(u => {
        if (!query) return true;
        return u.username.toLowerCase().includes(query) ||
               (u.firstname + ' ' + u.lastname).toLowerCase().includes(query);
      })
      .forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.id}</td>
          <td>${u.firstname} ${u.lastname}</td>
          <td>${u.username}</td>
          <td><span class="role-badge ${badgeClass(u.role)}">${u.role}</span></td>
          <td>
            <select data-userid="${u.id}">
              ${roleOptions.map(r => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${roleLabels[r] || r}</option>`).join('')}
            </select>
          </td>
          <td class="actions">
            <button class="btn-small" data-action="save" data-userid="${u.id}">Speichern</button>
            <button class="btn-small danger" data-action="delete" data-userid="${u.id}">Löschen</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
  };

  const load = async () => {
    try {
      users = await api.adminGetUsers();
      render();
    } catch (e) {
      alert('Konnte Benutzer nicht laden: ' + (e?.message || e));
    }
  };

  const saveRole = async (userId, role) => {
    try {
      await api.adminUpdateUserRole(userId, role);
      const u = users.find(x => x.id === userId);
      if (u) u.role = role;
      render();
      alert('Rolle aktualisiert');
    } catch (e) {
      alert('Fehler beim Aktualisieren: ' + (e?.message || e));
    }
  };

  const createUser = async (evt) => {
    evt.preventDefault();
    createMsg.textContent = '';
    const firstname = document.getElementById('create-firstname').value.trim();
    const lastname = document.getElementById('create-lastname').value.trim();
    const username = document.getElementById('create-username').value.trim();
    const password = document.getElementById('create-password').value;
    const role = document.getElementById('create-role').value;
    try {
      await api.adminCreateUser({ firstname, lastname, username, password, role });
      createMsg.textContent = 'Benutzer angelegt';
      createMsg.className = 'success';
      await load();
      createForm.reset();
    } catch (e) {
      createMsg.textContent = 'Fehler: ' + (e?.message || e);
      createMsg.className = 'error';
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Benutzer wirklich löschen?')) return;
    try {
      await api.adminDeleteUser(userId);
      users = users.filter(u => u.id !== userId);
      render();
    } catch (e) {
      alert('Fehler beim Löschen: ' + (e?.message || e));
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (!ensureAdmin()) return;

    load();

    roleFilter?.addEventListener('change', render);
    searchInput?.addEventListener('input', render);

    tableBody?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action="save"]');
      const del = e.target.closest('button[data-action="delete"]');
      if (btn) {
        const userId = Number(btn.dataset.userid);
        const select = tableBody.querySelector(`select[data-userid="${userId}"]`);
        if (!select) return;
        saveRole(userId, select.value);
      } else if (del) {
        const userId = Number(del.dataset.userid);
        deleteUser(userId);
      }
    });

    createForm?.addEventListener('submit', createUser);
  });
})();

// Sidebar

const toggleButton = document.getElementById('sidebar-toggle-button');
const sidebar = document.getElementById('sidebar');

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
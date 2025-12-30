(() => {
  const ensureTeacher = () => {
    const role = sessionStorage.getItem('role');
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      alert('Nur für Lehrkräfte/Admins. Bitte einloggen.');
      window.location.href = 'login.html';
      return false;
    }
    return true;
  };

  const hideAdminLinkForTeachers = () => {
    const role = sessionStorage.getItem('role');
    const adminLink = document.querySelector('a[href="admin.html"]');
    if (role !== 'ADMIN' && adminLink) {
      adminLink.closest('li')?.remove();
    }
  };

  const subjectSelect = document.getElementById('topic-subject');
  const msgSubject = document.getElementById('msg-subject');
  const msgSubjectList = document.getElementById('msg-subject-list');
  const msgTopic = document.getElementById('msg-topic');
  const msgMaterial = document.getElementById('msg-material');

  const subjectListEl = document.getElementById('subject-list');
  const manageSubjectSelect = document.getElementById('manage-subject-select');
  const manageTopicSelect = document.getElementById('manage-topic-select');
  const fileListEl = document.getElementById('file-management-list');

  let cachedSubjects = [];
  const topicsBySubject = new Map();
  let currentManageTopicId = null;

  const setMsg = (el, text, type = '') => {
    if (!el) return;
    el.textContent = text;
    el.className = 'msg' + (type ? ' ' + type : '');
  };

  const populateSubjectSelect = (select, subjects, placeholderText = '') => {
    if (!select) return;
    if (!subjects.length) {
      select.innerHTML = '<option value="">Keine Fächer verfügbar</option>';
      select.disabled = true;
      return;
    }

    const placeholder = placeholderText ? `<option value="">${placeholderText}</option>` : '';
    const options = subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    select.innerHTML = placeholder + options;
    select.disabled = false;

    if (!placeholderText) {
      select.value = subjects[0].id;
    }
  };

  const resetManageTopics = () => {
    if (!manageTopicSelect) return;
    manageTopicSelect.innerHTML = '<option value="">Bitte zuerst ein Fach wählen</option>';
    manageTopicSelect.disabled = true;
    currentManageTopicId = null;
    if (fileListEl) fileListEl.innerHTML = '<li class="nav-placeholder">Bitte ein Thema wählen.</li>';
  };

  const renderSubjectList = () => {
    if (!subjectListEl) return;
    if (!cachedSubjects.length) {
      subjectListEl.innerHTML = '<li class="nav-placeholder">Noch keine Fächer vorhanden.</li>';
      return;
    }

    subjectListEl.innerHTML = '';
    cachedSubjects.forEach((subject) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'manage-name';
      name.textContent = subject.name;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-danger';
      btn.textContent = 'Löschen';
      btn.addEventListener('click', () => handleDeleteSubject(subject.id));

      li.append(name, btn);
      subjectListEl.append(li);
    });
  };

  const loadSubjects = async () => {
    try {
      const subjects = await api.getAllSubjects();
      cachedSubjects = subjects;
      populateSubjectSelect(subjectSelect, subjects);
      populateSubjectSelect(manageSubjectSelect, subjects, manageSubjectSelect?.dataset.placeholder || 'Fach wählen');
      renderSubjectList();
    } catch (e) {
      setMsg(msgTopic, 'Fächer laden fehlgeschlagen: ' + (e?.message || e), 'error');
      setMsg(msgSubjectList, 'Fächer konnten nicht geladen werden.', 'error');
      resetManageTopics();
    }
  };

  const handleSubject = async (e) => {
    e.preventDefault();
    try {
      const name = document.getElementById('subject-name').value.trim();
      const desc = document.getElementById('subject-desc').value.trim();
      await api.createSubject(name, desc);
      setMsg(msgSubject, 'Fach angelegt.', 'success');
      e.target.reset();
      await loadSubjects();
    } catch (err) {
      setMsg(msgSubject, 'Fehler: ' + (err?.message || err), 'error');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!confirm('Dieses Fach wirklich löschen?')) return;
    try {
      await api.deleteSubject(subjectId);
      setMsg(msgSubjectList, 'Fach gelöscht.', 'success');
      topicsBySubject.delete(subjectId);
      await loadSubjects();
      resetManageTopics();
    } catch (err) {
      setMsg(msgSubjectList, 'Löschen fehlgeschlagen: ' + (err?.message || err), 'error');
    }
  };

  const handleTopic = async (e) => {
    e.preventDefault();
    try {
      const subjectId = Number(subjectSelect.value);
      const title = document.getElementById('topic-title').value.trim();
      const desc = document.getElementById('topic-desc').value.trim();
      await api.createTopic(subjectId, title, desc);
      topicsBySubject.delete(subjectId);
      setMsg(msgTopic, 'Thema angelegt.', 'success');
      e.target.reset();
    } catch (err) {
      setMsg(msgTopic, 'Fehler: ' + (err?.message || err), 'error');
    }
  };

  const loadTopicsForSubject = async (subjectId) => {
    if (!subjectId) return [];
    if (topicsBySubject.has(subjectId)) {
      return topicsBySubject.get(subjectId);
    }
    const topics = await api.getTopicsForSubject(subjectId);
    topicsBySubject.set(subjectId, topics);
    return topics;
  };

  const handleManageSubjectChange = async (event) => {
    const subjectId = Number(event.target.value);
    resetManageTopics();
    if (!subjectId) {
      return;
    }

    manageTopicSelect.disabled = true;
    manageTopicSelect.innerHTML = '<option value="">Themen werden geladen...</option>';
    try {
      const topics = await loadTopicsForSubject(subjectId);
      if (!topics.length) {
        manageTopicSelect.innerHTML = '<option value="">Keine Themen vorhanden</option>';
        manageTopicSelect.disabled = true;
        return;
      }
      manageTopicSelect.innerHTML = '<option value="">Thema wählen</option>' +
        topics.map(topic => `<option value="${topic.id}">${topic.title}</option>`).join('');
      manageTopicSelect.disabled = false;
    } catch (err) {
      manageTopicSelect.innerHTML = '<option value="">Fehler beim Laden</option>';
      setMsg(msgMaterial, 'Themen konnten nicht geladen werden: ' + (err?.message || err), 'error');
    }
  };

  const formatFileSize = (bytes = 0) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, idx);
    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[idx]}`;
  };

  const renderFileList = (files) => {
    if (!fileListEl) return;
    if (!files.length) {
      fileListEl.innerHTML = '<li class="nav-placeholder">Keine Dateien vorhanden.</li>';
      return;
    }
    fileListEl.innerHTML = '';
    files.forEach((file) => {
      const li = document.createElement('li');
      li.className = 'manage-item';

      const info = document.createElement('div');
      info.innerHTML = `<strong>${file.originalName}</strong><span class="manage-meta">${formatFileSize(file.size)} · Topic ${file.topicId}</span>`;

      const actions = document.createElement('div');
      actions.className = 'manage-actions';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-danger';
      btn.textContent = 'Löschen';
      btn.addEventListener('click', () => handleDeleteFile(file.id));

      actions.append(btn);
      li.append(info, actions);
      fileListEl.append(li);
    });
  };

  const loadMaterialsForTopic = async (topicId) => {
    if (!topicId) {
      resetManageTopics();
      return;
    }

    currentManageTopicId = topicId;
    if (fileListEl) fileListEl.innerHTML = '<li class="nav-placeholder">Dateien werden geladen...</li>';
    setMsg(msgMaterial, '', '');

    try {
      const files = await api.getFiles(topicId);
      renderFileList(files);
    } catch (err) {
      setMsg(msgMaterial, 'Material konnte nicht geladen werden: ' + (err?.message || err), 'error');
    }
  };

  const handleManageTopicChange = (event) => {
    const topicId = Number(event.target.value);
    if (!topicId) {
      if (fileListEl) fileListEl.innerHTML = '<li class="nav-placeholder">Bitte ein Thema wählen.</li>';
      if (textBlockListEl) textBlockListEl.innerHTML = '<li class="nav-placeholder">Bitte ein Thema wählen.</li>';
      return;
    }
    loadMaterialsForTopic(topicId);
  };

  const handleDeleteFile = async (fileId) => {
    if (!currentManageTopicId) return;
    if (!confirm('Diese Datei wirklich löschen?')) return;
    try {
      await api.deleteFile(fileId);
      setMsg(msgMaterial, 'Datei gelöscht.', 'success');
      await loadMaterialsForTopic(currentManageTopicId);
    } catch (err) {
      setMsg(msgMaterial, 'Datei konnte nicht gelöscht werden: ' + (err?.message || err), 'error');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (!ensureTeacher()) return;
    hideAdminLinkForTeachers();
    loadSubjects();

    document.getElementById('form-subject')?.addEventListener('submit', handleSubject);
    document.getElementById('form-topic')?.addEventListener('submit', handleTopic);
    manageSubjectSelect?.addEventListener('change', handleManageSubjectChange);
    manageTopicSelect?.addEventListener('change', handleManageTopicChange);
  });
})();

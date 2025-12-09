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

  const subjectSelect = document.getElementById('topic-subject');
  const msgSubject = document.getElementById('msg-subject');
  const msgTopic = document.getElementById('msg-topic');
  const msgContent = document.getElementById('msg-content');

  const setMsg = (el, text, type = '') => {
    if (!el) return;
    el.textContent = text;
    el.className = 'msg' + (type ? ' ' + type : '');
  };

  const loadSubjects = async () => {
    try {
      const subjects = await api.getSubjects();
      if (!subjectSelect) return;
      subjectSelect.innerHTML = subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    } catch (e) {
      setMsg(msgTopic, 'Fächer laden fehlgeschlagen: ' + (e?.message || e), 'error');
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

  const handleTopic = async (e) => {
    e.preventDefault();
    try {
      const subjectId = Number(subjectSelect.value);
      const title = document.getElementById('topic-title').value.trim();
      const desc = document.getElementById('topic-desc').value.trim();
      await api.createTopic(subjectId, title, desc);
      setMsg(msgTopic, 'Thema angelegt.', 'success');
      e.target.reset();
    } catch (err) {
      setMsg(msgTopic, 'Fehler: ' + (err?.message || err), 'error');
    }
  };

  const handleContent = async (e) => {
    e.preventDefault();
    try {
      const topicId = Number(document.getElementById('content-topic').value);
      const title = document.getElementById('content-title').value.trim();
      const posInput = document.getElementById('content-pos').value;
      const position = posInput ? Number(posInput) : 1;
      const text = document.getElementById('content-text').value;
      await api.createTextBlock(topicId, title, position, text);
      setMsg(msgContent, 'Text-Baustein gespeichert.', 'success');
      e.target.reset();
    } catch (err) {
      setMsg(msgContent, 'Fehler: ' + (err?.message || err), 'error');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (!ensureTeacher()) return;
    loadSubjects();

    document.getElementById('form-subject')?.addEventListener('submit', handleSubject);
    document.getElementById('form-topic')?.addEventListener('submit', handleTopic);
    document.getElementById('form-content')?.addEventListener('submit', handleContent);
  });
})();

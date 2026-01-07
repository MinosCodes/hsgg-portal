(() => {
  const ensureTeacher = () => {
    const role = localStorage.getItem('role');
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      alert('Nur für Lehrkräfte/Admins. Bitte einloggen.');
      window.location.href = 'login.html';
      return false;
    }
    return true;
  };

  const hideAdminLinkForTeachers = () => {
    const role = localStorage.getItem('role');
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
  const postListEl = document.getElementById('file-management-list');

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
    if (postListEl) postListEl.innerHTML = '<li class="nav-placeholder">Bitte ein Thema wählen.</li>';
  };

  /*
   * START: Upload
   */

  const uploadForm = document.querySelector('#file-upload-form');
  const uploadSubjectSelect = uploadForm.querySelector('#file-subject-select');
  const uploadTopicSelect = uploadForm.querySelector('#file-topic-select');
  const uploadTitleInput = uploadForm.querySelector('#material-title');
  const uploadPositionInput = uploadForm.querySelector('#material-position');
  const uploadFileInput = uploadForm.querySelector('#material-file');
  const uploadSolutionInput = uploadForm.querySelector('#solution-file');
  const uploadSubmitButton = uploadForm.querySelector('button[type="submit"]');
  const uploadMessage = uploadForm.querySelector('#file-upload-message');

  const uploadSetStatusMessage = (element, message = '', type = '') => {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('success', 'error');
    if (type) {
        element.classList.add(type);
    }
  };

  const uploadResetTopicSelect = (select) => {
      if (!select) return;
      select.innerHTML = '<option value="">Bitte zuerst ein Fach wählen</option>';
      select.disabled = true;
  };

  const uploadLoadTopicsForSubject = async (subjectId) => {
    if (!subjectId) return [];
    return await api.getTopicsForSubject(subjectId);
  };

  const uploadHandleSubjectChange = async (select) => {
    const topicTarget = document.getElementById(select?.dataset.topicTarget || '');
    if (!topicTarget) return;

    const subjectId = Number(select.value);
    if (!subjectId) {
        uploadResetTopicSelect(topicTarget);
        return;
    }

    topicTarget.disabled = true;
    topicTarget.innerHTML = '<option value="">Themen werden geladen...</option>';

    try {
        const topics = await uploadLoadTopicsForSubject(subjectId);
        topicTarget.innerHTML = '<option value="">Thema auswählen</option>';
        topics.forEach((topic) => {
            const option = document.createElement('option');
            option.value = topic.id;
            option.textContent = topic.title;
            topicTarget.append(option);
        });
        topicTarget.disabled = false;
    } catch (error) {
        console.error('Konnte Themen nicht laden:', error);
        topicTarget.innerHTML = '<option value="">Fehler beim Laden</option>';
    }
  };

  const uploadSetButtonLoading = (button, isLoading) => {
    if (!button) return;
    button.disabled = isLoading;
  };

  const uploadHandleFileUpload = async (event) => {
    event.preventDefault();
    const topicId = Number(uploadTopicSelect?.value);
    const title = uploadTitleInput?.value;
    const position = Number(uploadPositionInput?.value);
    const file = uploadFileInput?.files?.[0];
    const solution = uploadSolutionInput?.files?.[0] ?? null;

    uploadSetStatusMessage(uploadMessage);

    if (!topicId) {
        uploadSetStatusMessage(uploadMessage, 'Bitte zuerst ein Thema auswählen.', 'error');
        return;
    }
    if (!file) {
        uploadSetStatusMessage(uploadMessage, 'Bitte eine Datei auswählen.', 'error');
        return;
    }

    uploadSetButtonLoading(uploadSubmitButton, true);
    try {
        await createPost(topicId, position, title, file, solution);
        uploadSetStatusMessage(uploadMessage, 'Datei erfolgreich hochgeladen.', 'success');
        uploadForm?.reset();
        uploadResetTopicSelect(uploadTopicSelect);
    } catch (error) {
        console.error('Upload fehlgeschlagen:', error);
        uploadSetStatusMessage(uploadMessage, 'Fehler: ' + (error?.message || error), 'error');
    } finally {
        uploadSetButtonLoading(uploadSubmitButton, false);
    }
  };

  const initUpload = async () => {
      uploadSubjectSelect.addEventListener('change', (event) => uploadHandleSubjectChange(event.target));
      uploadForm.addEventListener('submit', uploadHandleFileUpload);
  }

  /*
   * END: Upload
   */

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
      populateSubjectSelect(uploadSubjectSelect, subjects, 'Fach wählen');
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
      manageTopicSelect.innerHTML = '<option value="">Thema wählen</option>' + topics.map(topic => `<option value="${topic.id}">${topic.title}</option>`).join('');
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

  const handleSavePost = async (id, titleInput, positionInput, fileInput, solutionInput) => {
    const { topicId } = splitPostId(id);

    const newPostData = {
      position: Number(positionInput.value)
    };
    newPostData[POST_TITLE_KEY] = titleInput.value;
    if (fileInput.files?.[0]) {
      const newFileInfo = await api.uploadFile(topicId, fileInput.files?.[0]);
      newPostData[POST_CONTENT_FILE_ID_KEY] = newFileInfo.id;
    }
    if (solutionInput.files?.[0]) {
      const newFileInfo = await api.uploadFile(topicId, solutionInput.files?.[0]);
      newPostData[POST_SOLUTION_FILE_ID_KEY] = newFileInfo.id;
    }

    await updatePost(id, newPostData);
  }

  const renderPostList = async (posts) => {
    if (!postListEl) return;
    if (!posts.length) {
      postListEl.innerHTML = '<li class="nav-placeholder">Keine Posts vorhanden.</li>';
      return;
    }
    postListEl.innerHTML = '';

    const files = Object.fromEntries((await api.getFiles()).map(f => [f.id, f]));

    posts.forEach((post) => {
      const li = document.createElement('li');
      li.className = 'manage-item';

      const manageContentContainer = document.createElement('div');
      manageContentContainer.classList.add('manage-content');
      
      const postTitleLabel = document.createElement('label');

      const postTitle = document.createElement('input');
      postTitle.classList.add('item-title');
      postTitle.type = 'text';
      postTitle.value = post.content.title;

      postTitleLabel.append('Titel: ', postTitle);
      
      const postPositionLabel = document.createElement('label');

      const postPosition = document.createElement('input');
      postPosition.classList.add('item-position');
      postPosition.type = 'number';
      postPosition.min = 0;
      postPosition.step = 1;
      postPosition.value = post.position;

      postPositionLabel.append('Position: ', postPosition);

      const postFileContainer = document.createElement('div');
      postFileContainer.classList.add('item-file');

      const postFileName = document.createElement('strong');
      postFileName.innerText = files[post.content[POST_CONTENT_FILE_ID_KEY]].originalName;

      const postFileOverwriteLabel = document.createElement('label');

      const postFileOverwriteSpan = document.createElement('span');
      postFileOverwriteSpan.innerText = 'Datei Austauschen:';

      const postFileOverwriteInput = document.createElement('input');
      postFileOverwriteInput.type = 'file';
      postFileOverwriteInput.accept = ".pdf,.txt,.png,.jpg,.jpeg,.webp";

      postFileOverwriteLabel.append(postFileOverwriteSpan, postFileOverwriteInput);

      postFileContainer.append(postFileName, postFileOverwriteLabel);
      
      const postSolutionFileContainer = document.createElement('div');
      postSolutionFileContainer.classList.add('item-solution');

      const postSolutionFileName = document.createElement('strong');
      postSolutionFileName.innerText = files[post.content[POST_SOLUTION_FILE_ID_KEY]]?.originalName ?? '-';

      const postSolutionFileOverwriteLabel = document.createElement('label');

      const postSolutionFileOverwriteSpan = document.createElement('span');
      postSolutionFileOverwriteSpan.innerText = 'Datei Austauschen:';

      const postSolutionFileOverwriteInput = document.createElement('input');
      postSolutionFileOverwriteInput.type = 'file';
      postSolutionFileOverwriteInput.accept = ".pdf,.txt,.png,.jpg,.jpeg,.webp";

      postSolutionFileOverwriteLabel.append(postSolutionFileOverwriteSpan, postSolutionFileOverwriteInput);

      postSolutionFileContainer.append(postSolutionFileName, postSolutionFileOverwriteLabel);

      manageContentContainer.append(postTitleLabel, postPositionLabel, postFileContainer, postSolutionFileContainer);

      const actions = document.createElement('div');
      actions.className = 'manage-actions';

      const saveChangesButton = document.createElement('button');
      saveChangesButton.type = 'button';
      saveChangesButton.className = 'btn';
      saveChangesButton.textContent = 'Speichern';
      saveChangesButton.addEventListener('click', () => handleSavePost(post.id, postTitle, postPosition, postFileOverwriteInput, postFileOverwriteInput));

      const deletePostButton = document.createElement('button');
      deletePostButton.type = 'button';
      deletePostButton.className = 'btn btn-danger';
      deletePostButton.textContent = 'Löschen';
      deletePostButton.addEventListener('click', () => handleDeletePost(post.id));

      actions.append(saveChangesButton, deletePostButton);
      li.append(manageContentContainer, actions);
      postListEl.append(li);
    });
  };

  const loadMaterialsForTopic = async (topicId) => {
    if (!topicId) {
      resetManageTopics();
      return;
    }

    currentManageTopicId = topicId;
    if (postListEl) postListEl.innerHTML = '<li class="nav-placeholder">Posts werden geladen...</li>';
    setMsg(msgMaterial, '', '');

    try {
      const posts = await getAllPostsForTopic(topicId);
      renderPostList(posts);
    } catch (err) {
      setMsg(msgMaterial, 'Material konnte nicht geladen werden: ' + (err?.message || err), 'error');
    }
  };

  const handleManageTopicChange = (event) => {
    const topicId = Number(event.target.value);
    if (!topicId) {
      if (postListEl) postListEl.innerHTML = '<li class="nav-placeholder">Bitte ein Thema wählen.</li>';
      return;
    }
    loadMaterialsForTopic(topicId);
  };

  const handleDeletePost = async (postId) => {
    if (!currentManageTopicId) return;
    if (!confirm('Diesen Post wirklich löschen?')) return;
    try {
      await deletePost(postId);
      setMsg(msgMaterial, 'Post gelöscht.', 'success');
      await loadMaterialsForTopic(currentManageTopicId);
    } catch (err) {
      setMsg(msgMaterial, 'Post konnte nicht gelöscht werden: ' + (err?.message || err), 'error');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (!ensureTeacher()) return;
    hideAdminLinkForTeachers();
    loadSubjects();
    initUpload();

    document.getElementById('form-subject')?.addEventListener('submit', handleSubject);
    document.getElementById('form-topic')?.addEventListener('submit', handleTopic);
    manageSubjectSelect?.addEventListener('change', handleManageSubjectChange);
    manageTopicSelect?.addEventListener('change', handleManageTopicChange);
  });
})();

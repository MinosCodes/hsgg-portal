Object.defineProperty(window, 'api', {
  enumerable: true,
  configurable: false,
  writable: false,
  value: Object.freeze({
    /**
     * Register a new user.
     * 
     * @param {string} username The user name to register as.
     * @param {string} password The password the user chose.
     * @param {string} firstname The first name of the user.
     * @param {string} lastname The last name of the user.
     * @returns Whatever text the backend sent back. (usually "Registered successfully")
     */
    register: async (username, password, firstname, lastname) => {
      if (typeof username !== 'string') throw new Error("The username must be a string.");
      if (typeof password !== 'string') throw new Error("The password must be a string.");
      if (typeof firstname !== 'string') throw new Error("The first name must be a string.");
      if (typeof lastname !== 'string') throw new Error("The last name must be a string.");

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          firstname,
          lastname
        })
      });
      if (!response.ok) {
        let errorMessage = `Request for registration failed with status code ${response.status}.`;
        try {
          const errorBody = await response.json();
          if (errorBody && errorBody.message) {
            errorMessage = errorBody.message;
          }
        } catch (e) {
          // ignore parsing error
        }
        throw new Error(errorMessage);
      }

      return await response.text();
    },
    /**
     * Log in as the specified user.
     * 
     * The token will get saved to the session store and is used automatically by other functions.
     * 
     * @param {string} username The user name.
     * @param {string} password The password.
     */
    login: async (username, password) => {
      if (typeof username !== 'string') throw new Error("The user name must be a string.");
      if (typeof password !== 'string') throw new Error("The password must be a string.");

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password
        })
      });
      if (!response.ok) throw new Error(`Request for login failed with status code ${response.status}.`);

      const { token, role, firstname, lastname } = await response.json();

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('firstname', firstname);
      sessionStorage.setItem('lastname', lastname);
    },
    /**
     * Logs the currently logged in user out by removing the authentication details from the session store.
     */
    logout: () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('firstname');
      sessionStorage.removeItem('lastname');
    },
    /**
     * Gets the role of the currently logged in user from the session store.
     * 
     * May also be used to check if somebody's logged in.
     * 
     * @returns The role of the currently logged in user or `null` if no one's logged in.
     */
    getRole: () => sessionStorage.getItem('role'),
    /**
     * Gets the name of the currently logged in user from the session store.
     * 
     * For convenience a toString function is provided on the returned object to make it useable as a string.
     * 
     * @returns An Object containing firstname and lastname of the currently logged in user or `null`.
     */
    getName: () => {
      const firstname = sessionStorage.getItem('firstname');
      if (firstname == null) return null;
      const lastname = sessionStorage.getItem('lastname');
      if (lastname == null) return null;

      return {
        firstname,
        lastname,
        toString: function () { return this.firstname + ' ' + this.lastname; }
      }
    },
    /**
     * Requests a list of all subjects.
     * 
     * @returns A List of all subjects
     */
    getAllSubjects: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");

      const response = await fetch('/api/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Request for subjects failed with status code ${response.status}.`);

      return await response.json();
    },
    /**
     * Requests a list of all topics for the specified subject.
     * 
     * @param {number} subjectId The subject id. Must be a non negative safe integer number.
     * @returns The list of topics for the specified subject.
     */
    getTopicsForSubject: async (subjectId) => {
      if (!Number.isSafeInteger(subjectId) || subjectId < 0) throw new Error("The subject id must be a non negative safe integer number.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");

      const response = await fetch(`/api/subjects/${subjectId}/topics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Request for subject (${subjectId}) topics failed with status code ${response.status}.`);

      return await response.json();
    },
    /**
     * Requests details about the specified topic.
     * 
     * @param {number} topicId The topic id. Must be a non negative safe integer number.
     * @returns The requested topic.
     */
    getTopic: async (topicId) => {
      if (!Number.isSafeInteger(topicId) || topicId < 0) throw new Error("The topic id must be a non negative safe integer number.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");

      const response = await fetch(`/api/topics/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Request for topic (${topicId}) failed with status code ${response.status}.`);

      return await response.json();
    },
    /**
     * Requests a list of all content for the specified topic.
     * 
     * @param {number} topicId The topic id. Must be a non negative safe integer number.
     * @returns A list of content.
     */
    getTopicContent: async (topicId) => {
      if (!Number.isSafeInteger(topicId) || topicId < 0) throw new Error("The topic id must be a non negative safe integer number.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");

      const response = await fetch(`/api/topics/${topicId}/content`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) throw new Error(`Request for topic (${topicId}) failed with status code ${response.status}.`);

      return await response.json();
    },
    /**
     * Returns a list of all Files.
     * If given a Topic id, only Files of that Topic will be listed.
     * 
     * @param {number?} topicId The Topic id. If present, must be a non negative safe integer number.
     * @returns List of files.
     */
    getFiles: async (topicId) => {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');

      let params = new URLSearchParams();
      if (topicId != null) {
        if (!Number.isSafeInteger(topicId) || topicId < 0) throw new Error("If specified, the topic id must be a non negative safe integer number.");
        params.append('topicId', topicId);
      }

      const response = await fetch('/api/files?' + params, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Request for files failed with status code ${response.status}.`);

      return await response.json();
    },
    /**
     * Downloads the specified file and makes it accessible via an object URL, which can, for example, be used in an iframes src to show the file on the webpage.
     * 
     * Does NOT download it in the sense that the user now has a file in his downloads folder!
     * To do that additional work is necessary but the Object URL returned by this function can and should be used for that.
     * 
     * @param {number} fileId The file id. Must be a non negative safe integer number.
     * @returns An Object URL ("blob:...") to the downloaded file.
     */
    getObjectUrlForFile: async (fileId) => {
      if (!Number.isSafeInteger(fileId) || fileId < 0) throw new Error("The file id must be a non negative safe integer number.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");

      const response = await fetch(`/api/files/${fileId}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Request for file (${fileId}) failed with status code ${response.status}.`);

      return URL.createObjectURL(await response.blob());
    },
    /**
     * Tells the backend to search for the specified search query and return the results.
     * 
     * @param {string} searchQuery What to search for.
     * @returns The search results.
     */
    search: async (searchQuery) => {
      if (typeof searchQuery !== 'string') throw new Error("The search query must be a string.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");

      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Request for search ("${searchQuery}") failed with status code ${response.status}.`);

      return await response.json();
    },
    /**
     * Creates a new Subject with the specified Name and Description.
     * 
     * Teacher and Admin only!
     * 
     * @param {string} name The Name of the new Subject.
     * @param {string} description The Description of the new Subject.
     */
    createSubject: async (name, description) => {
      if (typeof name !== 'string') throw new Error("The name must be a string.");
      if (typeof description !== 'string') throw new Error("The description must be a string.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      if (
        sessionStorage.getItem('role') !== 'TEACHER' &&
        sessionStorage.getItem('role') !== 'ADMIN'
      ) throw new Error("Not a teacher or admin.");

      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name,
          description
        })
      });
      if (!response.ok) throw new Error(`Create subject failed with status code ${response.status}.`);
    },
    /**
     * Changes the Name and/or Description of the specified Subject.
     *
     * Teacher and Admin only!
     * 
     * @param {number} subjectId 
     * @param {{ name?: string, description?: string }} info An object containing the new name (optional string) and description (optional string) of the subject.
     */
    updateSubject: async (subjectId, { name, description }) => {
      if (!Number.isSafeInteger(subjectId) || subjectId < 0) throw new Error("The subject id must be a non negative safe integer number.");

      const newSubjectInfo = {};
      if (name != null) {
        if (typeof name !== 'string') throw new Error("If specified, the name must be a string.");
        newSubjectInfo.name = name;
      }
      if (description != null) {
        if (typeof description !== 'string') throw new Error("If specified, the description must be a string.");
        newSubjectInfo.description = description;
      }

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      if (
        sessionStorage.getItem('role') !== 'TEACHER' &&
        sessionStorage.getItem('role') !== 'ADMIN'
      ) throw new Error("Not a teacher or admin.");

      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newSubjectInfo)
      });
      if (!response.ok) throw new Error(`Update Subject failed with status code ${response.status}.`);
    },
    /**
     * Deletes the specified Subject.
     * 
     * @param {number} subjectId The Subject id. Must be a non negative safe integer number.
     */
    deleteSubject: async (subjectId) => {
      if (!Number.isSafeInteger(subjectId) || subjectId < 0) throw new Error("The subject id must be a non negative safe integer number.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');
      if (
        sessionStorage.getItem('role') !== 'TEACHER' &&
        sessionStorage.getItem('role') !== 'ADMIN'
      ) throw new Error("Not a teacher or admin.");

      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Delete subject failed with status code ${response.status}.`);
    },
    /**
     * Creates a new Topic with the specified Title and Description.
     * 
     * Teacher and Admin only!
     * 
     * @param {number} subjectId The Subject id of the Subject the topic is on. Must be a non negative safe integer number.
     * @param {string} title The Title of the new Topic.
     * @param {string} description The Description of the new Topic.
     */
    createTopic: async (subjectId, title, description) => {
      if (!Number.isSafeInteger(subjectId) || subjectId < 0) throw new Error("The subject id must be a non negative safe integer number.");
      if (typeof title !== 'string') throw new Error("The title must be a string.");
      if (typeof description !== 'string') throw new Error("The description must be a string.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      if (
        sessionStorage.getItem('role') !== 'TEACHER' &&
        sessionStorage.getItem('role') !== 'ADMIN'
      ) throw new Error("Not a teacher or admin.");

      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          subjectId,
          title,
          description
        })
      });
      if (!response.ok) throw new Error(`Create topic failed with status code ${response.status}.`);
    },
    /**
     * Changes the Title and/or Description of the specified Topic.
     *
     * Teacher and Admin only!
     * 
     * @param {number} topicId The Topic id. Must be a non negative safe integer number.
     * @param {{ title?: string, description?: string }} info An object containing the new title and/or description of the topic.
     */
    updateTopic: async (topicId, { name: title, description }) => {
      if (!Number.isSafeInteger(topicId) || topicId < 0) throw new Error("The subject id must be a non negative safe integer number.");

      const newTopicInfo = {};
      if (title != null) {
        if (typeof title !== 'string') throw new Error("If specified, the name must be a string.");
        newTopicInfo.title = title;
      }
      if (description != null) {
        if (typeof description !== 'string') throw new Error("If specified, the description must be a string.");
        newTopicInfo.description = description;
      }

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      if (
        sessionStorage.getItem('role') !== 'TEACHER' &&
        sessionStorage.getItem('role') !== 'ADMIN'
      ) throw new Error("Not a teacher or admin.");

      const response = await fetch(`/api/topics/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newTopicInfo)
      });
      if (!response.ok) throw new Error(`Update Topic failed with status code ${response.status}.`);
    },
    /**
     * Deletes the specified Topic.
     * 
     * Teacher and Admin only!
     * 
     * @param {number} topicId The Topic id. Must be a non negative safe integer number.
     */
    deleteTopic: async (topicId) => {
      if (!Number.isSafeInteger(topicId) || topicId < 0) throw new Error("The topic id must be a non negative safe integer number.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');
      if (
        sessionStorage.getItem('role') !== 'TEACHER' &&
        sessionStorage.getItem('role') !== 'ADMIN'
      ) throw new Error("Not a teacher or admin.");

      const response = await fetch(`/api/topics/${topicId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Delete Topic failed with status code ${response.status}.`);
    },
    /**
     * Creates a new Content Block with Text content.
     * 
     * Internal only, NOT to be exposed to the User!
     * 
     * Teacher and Admin only!
     * 
     * @param {number} topicId The Topic id of the Topic the Content Block should be on. Must be a non negative safe integer number.
     * @param {string} title The Title of the Content Block.
     * @param {number} position The Position inside the Topic. Must be a non negative safe integer number.
     * @param {string} text The Text Content of the Content Block.
     */
    createTextBlock: async (topicId, title, position, text) => {
      if (!Number.isSafeInteger(topicId) || topicId < 0) throw new Error("The topic id must be a non negative safe integer number.");
      if (typeof title !== 'string') throw new Error("The title must be a string.");
      if (!Number.isSafeInteger(position) || position < 0) throw new Error("The position must be a non negative safe integer number.");
      if (typeof text !== 'string') throw new Error("The text must be a string.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      if (
        sessionStorage.getItem('role') !== 'TEACHER' &&
        sessionStorage.getItem('role') !== 'ADMIN'
      ) throw new Error("Not a teacher or admin.");

      const response = await fetch('/api/content/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          topicId,
          title,
          position,
          text
        })
      });
      if (!response.ok) throw new Error(`Create content failed with status code ${response.status}.`);
    },
    /**
     * Changes the Title, Position and/or Text Content of the specified Content Block.
     * 
     * Internal only, NOT to be exposed to the User!
     * 
     * Teacher and Admin only!
     * 
     * @param {number} blockId The Block id. Must be a non negative safe integer number.
     * @param {{ title?: string, position?: number, text?: string }} info An object containing the new Title, Position and/or Text Content of the Content Block.
     */
    updateTextBlock: async (blockId, { title, position, text }) => {
      if (!Number.isSafeInteger(blockId) || blockId < 0) throw new Error("The topic id must be a non negative safe integer number.");

      const newBlockData = {};
      if (title != null) {
        if (typeof title !== 'string') throw new Error("If specified, the name must be a string.");
        newBlockData.title = title;
      }
      if (title != null) {
        if (!Number.isSafeInteger(position) || position < 0) throw new Error("If specified, the position must be a non negative safe integer number.");
        newBlockData.position = position;
      }
      if (text != null) {
        if (typeof text !== 'string') throw new Error("If specified, the description must be a string.");
        newBlockData.description = text;
      }

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      if (
        sessionStorage.getItem('role') !== 'TEACHER' &&
        sessionStorage.getItem('role') !== 'ADMIN'
      ) throw new Error("Not a teacher or admin.");

      const response = await fetch(`/api/content/${blockId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newBlockData)
      });
      if (!response.ok) throw new Error(`Create content failed with status code ${response.status}.`);
    },
    /**
     * Deletes the specified Content Block.
     * 
     * Internal only, NOT to be exposed to the User!
     * 
     * Teacher and Admin only!
     * 
     * @param {number} blockId The Block id. Must be a non negative safe integer number.
     */
    deleteContentBlock: async (blockId) => {
      if (!Number.isSafeInteger(blockId) || blockId < 0) throw new Error("The block id must be a non negative safe integer number.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');
      if (
        sessionStorage.getItem('role') !== 'TEACHER' &&
        sessionStorage.getItem('role') !== 'ADMIN'
      ) throw new Error("Not a teacher or admin.");

      const response = await fetch(`/api/content/${blockId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Delete content block failed with status code ${response.status}.`);
    },
    /**
     * Uploads a file to the backend.
     * 
     * Teacher and Admin only!
     * 
     * @param {number} topicId The Topic id of the Topic the File should be on. Must be a non negative safe integer number.
     * @param {File} file The file to upload.
     * @returns TODO
     */
    uploadFile: async (topicId, file) => {
      if (!Number.isSafeInteger(topicId) || topicId < 0) throw new Error("The Topic id must be a non negative safe integer number.");
      if (!(file instanceof File)) throw new Error("The File must be an instance of the File class.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');

      const body = new FormData();
      body.append('topicId', topicId);
      body.append('file', file);

      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body
      });

      if (!response.ok) {
        let errorMessage = `File upload failed with status code ${response.status}.`;
        try {
          const errorBody = await response.json();
          if (errorBody && errorBody.message) {
            errorMessage = errorBody.message;
          }
        } catch (e) {
          // ignore parsing error
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    },
    /**
     * Deletes the specified File.
     * 
     * Teacher and Admin only!
     * 
     * @param {number} fileId The File id. Must be a non negative safe integer number.
     */
    deleteFile: async (fileId) => {
      if (!Number.isSafeInteger(fileId) || fileId < 0) throw new Error("The File id must be a non negative safe integer number.");
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');

      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Delete file failed with status code ${response.status}.`);
    },
    /**
     * Requests a list of all users and their info.
     * 
     * Admin only!
     * 
     * @returns A list of all users and their info.
     */
    getAllUsers: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      if (sessionStorage.getItem('role') !== 'ADMIN') throw new Error("Not an admin.");

      const response = await fetch(`/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Request for users failed with status code ${response.status}.`);

      return await response.json();
    },
    /**
     * Creates a new user with the specified role.
     * 
     * Admin only!
     * 
     * @param {string} username The user name to register as.
     * @param {string} password The password the user chose.
     * @param {string} firstname The first name of the user.
     * @param {string} lastname The last name of the user.
     * @param {string} role The role of the user.
     */
    createUser: async (username, password, firstname, lastname, role) => {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      if (sessionStorage.getItem('role') !== 'ADMIN') throw new Error("Not an admin.");

      const response = await fetch(`/api/admin/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          firstname,
          lastname,
          role
        })
      });
      if (!response.ok) throw new Error(`Request for user creation failed with status code ${response.status}.`);
    },
    /**
     * Changes the role of the specified user.
     * 
     * Admin only!
     * 
     * @param {numer} userId The user id. Must be a non negative safe integer number.
     * @param {string} role The new role of the user.
     */
    changeRole: async (userId, role) => {
      if (!Number.isSafeInteger(userId) || userId < 0) throw new Error("The user id must be a non negative safe integer number.");
      if (typeof role !== 'string') throw new Error("The role must be a string.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      if (sessionStorage.getItem('role') !== 'ADMIN') throw new Error("Not an admin.");

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });
      if (!response.ok) throw new Error(`Request for user (${userId}) role change failed with status code ${response.status}.`);
    },
    /**
     * Deletes the specified user.
     * 
     * Admin only!
     * 
     * @param {numer} userId The user id. Must be a non negative safe integer number.
     */
    deleteUser: async (userId) => {
      if (!Number.isSafeInteger(userId) || userId < 0) throw new Error("The user id must be a non negative safe integer number.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      if (sessionStorage.getItem('role') !== 'ADMIN') throw new Error("Not an admin.");

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Deleting user (${userId}) failed with status code ${response.status}.`);
    },
  })
});

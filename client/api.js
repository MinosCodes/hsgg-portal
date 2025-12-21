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
      if (!response.ok) throw new Error(`Request for registration failed with status code ${response.status}.`);
      
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
        toString: function() { return this.firstname + ' ' + this.lastname; }
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
     * Admin: list all users with their roles.
     */
    adminGetUsers: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");

      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Request for users failed with status code ${response.status}.`);

      return await response.json();
    },

    /**
     * Admin: update a user's role.
     */
    adminUpdateUserRole: async (userId, role) => {
      if (!Number.isSafeInteger(userId) || userId < 0) throw new Error("The user id must be a positive safe integer number.");
      if (typeof role !== 'string') throw new Error("Role must be a string.");

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });
      if (!response.ok) throw new Error(`Updating user role failed with status code ${response.status}.`);
    },

    /**
     * Admin: delete a user.
     */
    adminDeleteUser: async (userId) => {
      if (!Number.isSafeInteger(userId) || userId < 0) throw new Error("The user id must be a positive safe integer number.");
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Deleting user failed with status code ${response.status}.`);
    },

    /**
     * Admin: create a user.
     */
    adminCreateUser: async ({ firstname, lastname, username, password, role }) => {
      if (!firstname || !lastname || !username || !password || !role) throw new Error('All fields are required');

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ firstname, lastname, username, password, role })
      });
      if (!response.ok) throw new Error(`Creating user failed with status code ${response.status}.`);
    },

    /**
     * Teacher/Admin: create subject.
     */
    createSubject: async (name, description) => {
      if (!name) throw new Error('Name required');
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description: description || '' })
      });
      if (!response.ok) throw new Error(`Create subject failed with status code ${response.status}.`);
    },

    deleteSubject: async (subjectId) => {
      if (!Number.isSafeInteger(subjectId) || subjectId < 1) throw new Error('Valid subject required');
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');

      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Delete subject failed with status code ${response.status}.`);
    },

    /**
     * Teacher/Admin: create topic.
     */
    createTopic: async (subjectId, title, description) => {
      if (!Number.isSafeInteger(subjectId) || subjectId < 0) throw new Error('Valid subject required');
      if (!title) throw new Error('Title required');
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subjectId, title, description: description || '' })
      });
      if (!response.ok) throw new Error(`Create topic failed with status code ${response.status}.`);
    },

    /**
     * Teacher/Admin: create text content block.
     */
    createTextBlock: async (topicId, title, position, text) => {
      if (!Number.isSafeInteger(topicId) || topicId < 0) throw new Error('Valid topic required');
      if (!title) throw new Error('Title required');
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not Logged In");
      const response = await fetch('/api/content/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topicId, title, position: position ?? 1, text: text || '' })
      });
      if (!response.ok) throw new Error(`Create content failed with status code ${response.status}.`);
    },

    deleteContentBlock: async (blockId) => {
      if (!Number.isSafeInteger(blockId) || blockId < 1) throw new Error('Valid content block required');
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');

      const response = await fetch(`/api/content/${blockId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Delete content block failed with status code ${response.status}.`);
    },

    /**
     * Teacher/Admin: upload a file for a topic.
     */
    uploadFile: async (topicId, file) => {
      if (!Number.isSafeInteger(topicId) || topicId < 0) throw new Error('Valid topic required');
      if (!(file instanceof File)) throw new Error('A file must be selected.');

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');

      const formData = new FormData();
      formData.append('topicId', topicId);
      formData.append('file', file);

      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error(`File upload failed with status code ${response.status}.`);

      return await response.json();
    },

    getFiles: async (topicId) => {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');

      let endpoint = '/api/files';
      if (topicId != null) {
        if (!Number.isSafeInteger(topicId) || topicId < 1) throw new Error('Valid topic required');
        endpoint += `?topicId=${topicId}`;
      }

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Request for files failed with status code ${response.status}.`);

      return await response.json();
    },

    deleteFile: async (fileId) => {
      if (!Number.isSafeInteger(fileId) || fileId < 1) throw new Error('Valid file required');
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Not Logged In');

      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Delete file failed with status code ${response.status}.`);
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
    }
  })
});

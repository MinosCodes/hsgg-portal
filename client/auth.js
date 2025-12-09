(function() {
    const buildButton = (label, className) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.className = className;
        return btn;
    };

    const buildLink = (label, href, className) => {
        const link = document.createElement('a');
        link.textContent = label;
        link.href = href;
        link.className = className;
        return link;
    };

    window.renderUserControls = (containerId = 'user-controls') => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const token = sessionStorage.getItem('token');
        const firstname = sessionStorage.getItem('firstname');
        const lastname = sessionStorage.getItem('lastname');
        const hasName = firstname || lastname;

        container.innerHTML = '';

        if (token) {
            const greeting = document.createElement('span');
            greeting.className = 'user-greeting';
            greeting.textContent = hasName ? `Hi, ${[firstname, lastname].filter(Boolean).join(' ')}` : 'Angemeldet';

            const logoutBtn = buildButton('Logout', 'user-action logout');
            logoutBtn.addEventListener('click', () => {
                api.logout();
                window.location.href = 'homepage.html';
            });

            container.append(greeting, logoutBtn);
        } else {
            const loginLink = buildLink('Login', 'login.html', 'user-action');
            const signupLink = buildLink('Signup', 'login.html#signup', 'user-action accent');
            container.append(loginLink, signupLink);
        }
    };
})();

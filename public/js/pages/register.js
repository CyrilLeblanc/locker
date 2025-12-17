document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    errorDiv.classList.add('d-none');
    successDiv.classList.add('d-none');

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            successDiv.textContent = 'Compte créé avec succès ! Redirection...';
            successDiv.classList.remove('d-none');
            setTimeout(() => {
                window.location.href = data.redirectUrl || '/dashboard';
            }, 1500);
        } else {
            errorDiv.textContent = data.error || 'Erreur lors de l\'inscription';
            errorDiv.classList.remove('d-none');
        }
    } catch (err) {
        errorDiv.textContent = 'Erreur de connexion au serveur';
        errorDiv.classList.remove('d-none');
    }
});

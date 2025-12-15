document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageDiv = document.getElementById('reset-message');
    messageDiv.classList.add('d-none');
    messageDiv.classList.remove('alert-success', 'alert-danger');
    
    const token = document.getElementById('token').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        messageDiv.classList.remove('d-none');
        messageDiv.classList.add('alert-danger');
        messageDiv.textContent = 'Les mots de passe ne correspondent pas.';
        return;
    }
    
    try {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        });
        
        const data = await response.json();
        
        messageDiv.classList.remove('d-none');
        if (response.ok) {
            messageDiv.classList.add('alert-success');
            messageDiv.innerHTML = data.message + ' <a href="/login">Connectez-vous</a>';
        } else {
            messageDiv.classList.add('alert-danger');
            messageDiv.textContent = data.error;
        }
    } catch (error) {
        messageDiv.classList.remove('d-none');
        messageDiv.classList.add('alert-danger');
        messageDiv.textContent = 'Une erreur est survenue. Veuillez réessayer.';
    }
});

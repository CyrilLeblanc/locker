document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageDiv = document.getElementById('forgot-message');
    messageDiv.classList.add('d-none');
    messageDiv.classList.remove('alert-success', 'alert-danger');
    
    const email = document.getElementById('email').value;
    
    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        messageDiv.classList.remove('d-none');
        if (response.ok) {
            messageDiv.classList.add('alert-success');
            messageDiv.textContent = data.message;
            document.getElementById('forgot-password-form').reset();
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

document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert('Signup successful');
        window.location.href = 'login.html';
    } else {
        alert('Signup failed: ' + (await response.text()));
    }
});
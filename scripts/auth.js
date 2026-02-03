document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (login === 'admin' && password === 'admin123') {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('username', login);
        
        window.location.href = 'main.html';
    } else {
        errorMessage.textContent = 'Невірний логін або пароль!';
        errorMessage.classList.add('show');
        
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
});

window.addEventListener('load', () => {
    document.querySelector('.auth-card').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.auth-card').style.opacity = '1';
    }, 100);
});
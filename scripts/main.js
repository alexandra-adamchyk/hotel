function checkAuth() {
    if (!sessionStorage.getItem('isAuthenticated')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('username');
    window.location.href = 'index.html';
}

window.addEventListener('load', () => {
    checkAuth();
    
    if (!localStorage.getItem('rooms')) {
        localStorage.setItem('rooms', JSON.stringify([]));
    }
    if (!localStorage.getItem('guests')) {
        localStorage.setItem('guests', JSON.stringify([]));
    }
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }
    if (!localStorage.getItem('services')) {
        localStorage.setItem('services', JSON.stringify([]));
    }
});
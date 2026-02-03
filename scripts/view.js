function checkAuth() {
    if (!sessionStorage.getItem('isAuthenticated')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function getRooms() {
    const rooms = localStorage.getItem('rooms');
    return rooms ? JSON.parse(rooms) : [];
}

function getGuests() {
    const guests = localStorage.getItem('guests');
    return guests ? JSON.parse(guests) : [];
}

function getBookings() {
    const bookings = localStorage.getItem('bookings');
    return bookings ? JSON.parse(bookings) : [];
}

function getServices() {
    const services = localStorage.getItem('services');
    return services ? JSON.parse(services) : [];
}

function getRoomTypeName(type) {
    const types = {
        'standard': 'Стандарт',
        'comfort': 'Комфорт',
        'lux': 'Люкс',
        'president': 'Президентський'
    };
    return types[type] || type;
}

function getStatusName(status) {
    const statuses = {
        'available': 'Вільний',
        'occupied': 'Зайнятий',
        'cleaning': 'На прибиранні'
    };
    return statuses[status] || status;
}

function displayRoomsTable() {
    const rooms = getRooms();
    const tbody = document.getElementById('roomsTableBody');
    
    if (rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">Даних немає</td></tr>';
        return;
    }
    
    tbody.innerHTML = rooms.map(room => `
        <tr>
            <td>${room.number}</td>
            <td>${getRoomTypeName(room.type)}</td>
            <td>${room.price} грн</td>
            <td>${room.discount}%</td>
            <td class="status-${room.status}">${getStatusName(room.status)}</td>
        </tr>
    `).join('');
}

function displayGuestsTable() {
    const guests = getGuests();
    const tbody = document.getElementById('guestsTableBody');
    
    if (guests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">Даних немає</td></tr>';
        return;
    }
    
    tbody.innerHTML = guests.map(guest => `
        <tr>
            <td>${guest.fullName}</td>
            <td>${guest.passport}</td>
            <td>${guest.phone}</td>
            <td>${guest.email || '-'}</td>
            <td>${guest.room}</td>
            <td>${guest.checkIn}</td>
            <td>${guest.checkOut}</td>
        </tr>
    `).join('');
}

function displayBookingsTable() {
    const bookings = getBookings();
    const tbody = document.getElementById('bookingsTableBody');
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">Даних немає</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.guestName}</td>
            <td>${getRoomTypeName(booking.roomType)}</td>
            <td>${booking.checkIn}</td>
            <td>${booking.checkOut}</td>
            <td>${booking.guests}</td>
            <td>${booking.status}</td>
        </tr>
    `).join('');
}

function displayServicesTable() {
    const services = getServices();
    const tbody = document.getElementById('servicesTableBody');
    
    if (services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">Даних немає</td></tr>';
        return;
    }
    
    tbody.innerHTML = services.map(service => `
        <tr>
            <td>${service.guestName}</td>
            <td>${service.serviceName}</td>
            <td>${service.quantity}</td>
            <td>${service.price} грн</td>
            <td>${service.date}</td>
            <td><strong>${service.totalPrice} грн</strong></td>
        </tr>
    `).join('');
}

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

window.addEventListener('load', () => {
    checkAuth();
    displayRoomsTable();
    displayGuestsTable();
    displayBookingsTable();
    displayServicesTable();
});
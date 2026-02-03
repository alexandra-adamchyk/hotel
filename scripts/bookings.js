function checkAuth() {
    if (!sessionStorage.getItem('isAuthenticated')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function getBookings() {
    const bookings = localStorage.getItem('bookings');
    return bookings ? JSON.parse(bookings) : [];
}

function saveBookings(bookings) {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function getGuests() {
    const guests = localStorage.getItem('guests');
    return guests ? JSON.parse(guests) : [];
}

function getRooms() {
    const rooms = localStorage.getItem('rooms');
    return rooms ? JSON.parse(rooms) : [];
}

function loadGuestsSelect() {
    const guests = getGuests();
    const select = document.getElementById('guestSelect');
    
    select.innerHTML = '<option value="">Оберіть клієнта</option>';
    
    guests.forEach((guest, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${guest.fullName} (${guest.phone})`;
        select.appendChild(option);
    });
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

function checkAvailability() {
    const roomType = document.getElementById('roomTypeSelect').value;
    const checkIn = document.getElementById('bookingCheckIn').value;
    const checkOut = document.getElementById('bookingCheckOut').value;
    const availabilityDiv = document.getElementById('availability');
    
    if (!roomType || !checkIn || !checkOut) {
        availabilityDiv.innerHTML = '';
        return;
    }
    
    if (new Date(checkOut) <= new Date(checkIn)) {
        availabilityDiv.innerHTML = '<div class="availability-message unavailable">Дата виїзду повинна бути пізніше дати заїзду!</div>';
        return;
    }
    
    const rooms = getRooms();
    const availableRooms = rooms.filter(room => 
        room.type === roomType && room.status === 'available'
    );
    
    if (availableRooms.length > 0) {
        availabilityDiv.innerHTML = `<div class="availability-message available">✓ Доступно номерів: ${availableRooms.length}</div>`;
    } else {
        availabilityDiv.innerHTML = '<div class="availability-message unavailable">✗ Немає вільних номерів обраного типу</div>';
    }
}

function displayBookings() {
    const bookings = getBookings();
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Бронювань ще немає</p>';
        return;
    }
    
    bookingsList.innerHTML = bookings.map((booking, index) => `
        <div class="list-item">
            <h4>${booking.guestName}</h4>
            <p><strong>Тип номера:</strong> ${getRoomTypeName(booking.roomType)}</p>
            <p><strong>Заїзд:</strong> ${booking.checkIn}</p>
            <p><strong>Виїзд:</strong> ${booking.checkOut}</p>
            <p><strong>Кількість гостей:</strong> ${booking.guests}</p>
            <p><strong>Статус:</strong> ${booking.status}</p>
            <div class="item-actions">
                <button class="btn-delete" onclick="deleteBooking(${index})">Скасувати</button>
            </div>
        </div>
    `).join('');
}

document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const guestIndex = document.getElementById('guestSelect').value;
    const guests = getGuests();
    const guest = guests[guestIndex];
    
    if (!guest) {
        alert('Оберіть клієнта!');
        return;
    }
    
    const roomType = document.getElementById('roomTypeSelect').value;
    const checkIn = document.getElementById('bookingCheckIn').value;
    const checkOut = document.getElementById('bookingCheckOut').value;
    const guestsCount = document.getElementById('guests').value;
    
    if (new Date(checkOut) <= new Date(checkIn)) {
        alert('Дата виїзду повинна бути пізніше дати заїзду!');
        return;
    }
    
    const rooms = getRooms();
    const availableRooms = rooms.filter(room => 
        room.type === roomType && room.status === 'available'
    );
    
    if (availableRooms.length === 0) {
        alert('Немає вільних номерів обраного типу!');
        return;
    }
    
    const booking = {
        guestName: guest.fullName,
        guestPhone: guest.phone,
        roomType: roomType,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guestsCount,
        status: 'Підтверджено',
        createdAt: new Date().toISOString()
    };
    
    const bookings = getBookings();
    bookings.push(booking);
    saveBookings(bookings);
    
    displayBookings();
    this.reset();
    document.getElementById('availability').innerHTML = '';
    
    alert('Бронювання успішно створено!');
});

function deleteBooking(index) {
    if (confirm('Ви впевнені, що хочете скасувати це бронювання?')) {
        const bookings = getBookings();
        bookings.splice(index, 1);
        saveBookings(bookings);
        displayBookings();
    }
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingCheckIn').setAttribute('min', today);
    document.getElementById('bookingCheckOut').setAttribute('min', today);
}

document.getElementById('roomTypeSelect').addEventListener('change', checkAvailability);
document.getElementById('bookingCheckIn').addEventListener('change', checkAvailability);
document.getElementById('bookingCheckOut').addEventListener('change', checkAvailability);

window.addEventListener('load', () => {
    checkAuth();
    loadGuestsSelect();
    displayBookings();
    setMinDate();
});
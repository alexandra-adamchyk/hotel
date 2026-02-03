function checkAuth() {
    if (!sessionStorage.getItem('isAuthenticated')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function getGuests() {
    const guests = localStorage.getItem('guests');
    return guests ? JSON.parse(guests) : [];
}

function saveGuests(guests) {
    localStorage.setItem('guests', JSON.stringify(guests));
}

function getRooms() {
    const rooms = localStorage.getItem('rooms');
    return rooms ? JSON.parse(rooms) : [];
}

function loadRoomsSelect() {
    const rooms = getRooms().filter(room => room.status === 'available');
    const select = document.getElementById('roomSelect');
    
    select.innerHTML = '<option value="">Оберіть номер</option>';
    
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.number;
        option.textContent = `Номер ${room.number} (${getRoomTypeName(room.type)}) - ${room.price} грн/доба`;
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

function displayGuests() {
    const guests = getGuests();
    const guestsList = document.getElementById('guestsList');
    
    if (guests.length === 0) {
        guestsList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Відвідувачів ще не зареєстровано</p>';
        return;
    }
    
    guestsList.innerHTML = guests.map((guest, index) => `
        <div class="list-item">
            <h4>${guest.fullName}</h4>
            <p><strong>Паспорт:</strong> ${guest.passport}</p>
            <p><strong>Телефон:</strong> ${guest.phone}</p>
            <p><strong>Email:</strong> ${guest.email || 'Не вказано'}</p>
            <p><strong>Номер:</strong> ${guest.room}</p>
            <p><strong>Заїзд:</strong> ${guest.checkIn}</p>
            <p><strong>Виїзд:</strong> ${guest.checkOut}</p>
            <div class="item-actions">
                <button class="btn-delete" onclick="deleteGuest(${index})">Видалити</button>
            </div>
        </div>
    `).join('');
}

document.getElementById('guestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const guest = {
        fullName: document.getElementById('fullName').value,
        passport: document.getElementById('passport').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        room: document.getElementById('roomSelect').value,
        checkIn: document.getElementById('checkIn').value,
        checkOut: document.getElementById('checkOut').value
    };
    
    if (new Date(guest.checkOut) <= new Date(guest.checkIn)) {
        alert('Дата виїзду повинна бути пізніше дати заїзду!');
        return;
    }
    
    const guests = getGuests();
    guests.push(guest);
    saveGuests(guests);
    
    const rooms = getRooms();
    const roomIndex = rooms.findIndex(r => r.number === guest.room);
    if (roomIndex !== -1) {
        rooms[roomIndex].status = 'occupied';
        localStorage.setItem('rooms', JSON.stringify(rooms));
    }
    
    displayGuests();
    loadRoomsSelect();
    
    this.reset();
    
    alert('Відвідувач успішно зареєстрований!');
});

function deleteGuest(index) {
    if (confirm('Ви впевнені, що хочете видалити цього відвідувача?')) {
        const guests = getGuests();
        const guest = guests[index];
        
        const rooms = getRooms();
        const roomIndex = rooms.findIndex(r => r.number === guest.room);
        if (roomIndex !== -1) {
            rooms[roomIndex].status = 'available';
            localStorage.setItem('rooms', JSON.stringify(rooms));
        }
        
        guests.splice(index, 1);
        saveGuests(guests);
        displayGuests();
        loadRoomsSelect();
    }
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').setAttribute('min', today);
    document.getElementById('checkOut').setAttribute('min', today);
}

window.addEventListener('load', () => {
    checkAuth();
    loadRoomsSelect();
    displayGuests();
    setMinDate();
});
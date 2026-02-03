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

function saveRooms(rooms) {
    localStorage.setItem('rooms', JSON.stringify(rooms));
}

function displayRooms() {
    const rooms = getRooms();
    const roomsList = document.getElementById('roomsList');
    
    if (rooms.length === 0) {
        roomsList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Номерів ще не додано</p>';
        return;
    }
    
    roomsList.innerHTML = rooms.map((room, index) => `
        <div class="list-item">
            <h4>Номер ${room.number}</h4>
            <p><strong>Тип:</strong> ${getRoomTypeName(room.type)}</p>
            <p><strong>Ціна:</strong> ${room.price} грн/доба</p>
            <p><strong>Знижка:</strong> ${room.discount}%</p>
            <p><strong>Статус:</strong> <span class="status-${room.status}">${getStatusName(room.status)}</span></p>
            <div class="item-actions">
                <button class="btn-edit" onclick="editRoom(${index})">Редагувати</button>
                <button class="btn-delete" onclick="deleteRoom(${index})">Видалити</button>
            </div>
        </div>
    `).join('');
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

document.getElementById('roomForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const room = {
        number: document.getElementById('roomNumber').value,
        type: document.getElementById('roomType').value,
        price: parseInt(document.getElementById('price').value),
        discount: parseInt(document.getElementById('discount').value),
        status: document.getElementById('status').value
    };
    
    const rooms = getRooms();
    
    if (rooms.some(r => r.number === room.number)) {
        alert('Номер з таким номером вже існує!');
        return;
    }
    
    rooms.push(room);
    saveRooms(rooms);
    displayRooms();
    
    this.reset();
    
    alert('Номер успішно додано!');
});

function deleteRoom(index) {
    if (confirm('Ви впевнені, що хочете видалити цей номер?')) {
        const rooms = getRooms();
        rooms.splice(index, 1);
        saveRooms(rooms);
        displayRooms();
    }
}

function editRoom(index) {
    const rooms = getRooms();
    const room = rooms[index];
    
    document.getElementById('roomNumber').value = room.number;
    document.getElementById('roomType').value = room.type;
    document.getElementById('price').value = room.price;
    document.getElementById('discount').value = room.discount;
    document.getElementById('status').value = room.status;
    
    deleteRoom(index);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('load', () => {
    checkAuth();
    displayRooms();
});
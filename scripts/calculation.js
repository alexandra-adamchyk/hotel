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

function getRooms() {
    const rooms = localStorage.getItem('rooms');
    return rooms ? JSON.parse(rooms) : [];
}

function getServices() {
    const services = localStorage.getItem('services');
    return services ? JSON.parse(services) : [];
}

function loadGuestsSelect() {
    const guests = getGuests();
    const select = document.getElementById('calcGuestSelect');
    
    select.innerHTML = '<option value="">Оберіть клієнта</option>';
    
    guests.forEach((guest, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${guest.fullName} (Номер ${guest.room})`;
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

document.getElementById('calculateBtn').addEventListener('click', function() {
    const guestIndex = document.getElementById('calcGuestSelect').value;
    const guests = getGuests();
    const guest = guests[guestIndex];
    
    if (!guest) {
        alert('Оберіть клієнта!');
        return;
    }
    
    const rooms = getRooms();
    const room = rooms.find(r => r.number === guest.room);
    
    if (!room) {
        alert('Номер не знайдено!');
        return;
    }
    
    const checkInDate = new Date(guest.checkIn);
    const checkOutDate = new Date(guest.checkOut);
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    const roomCostPerDay = room.price;
    const roomTotalCost = roomCostPerDay * days;
    
    const discountPercent = room.discount;
    const discountAmount = (roomTotalCost * discountPercent) / 100;
    const roomCostAfterDiscount = roomTotalCost - discountAmount;
    
    const services = getServices();
    const guestServices = services.filter(s => s.guestName === guest.fullName);
    const servicesCost = guestServices.reduce((sum, service) => sum + service.totalPrice, 0);
    
    const totalCost = roomCostAfterDiscount + servicesCost;
    
    document.getElementById('resultGuest').textContent = guest.fullName;
    document.getElementById('resultRoom').textContent = `${guest.room} (${getRoomTypeName(room.type)})`;
    document.getElementById('resultPeriod').textContent = `${guest.checkIn} - ${guest.checkOut}`;
    document.getElementById('resultDays').textContent = days;
    document.getElementById('resultRoomCost').textContent = `${roomTotalCost.toFixed(2)} грн`;
    document.getElementById('resultDiscount').textContent = `${discountPercent}% (-${discountAmount.toFixed(2)} грн)`;
    document.getElementById('resultServices').textContent = `${servicesCost.toFixed(2)} грн`;
    document.getElementById('resultTotal').textContent = `${totalCost.toFixed(2)} грн`;
    
    const servicesDetails = document.getElementById('servicesDetails');
    if (guestServices.length > 0) {
        servicesDetails.innerHTML = `
            <h3>Деталі додаткових послуг:</h3>
            ${guestServices.map(service => `
                <div class="service-item">
                    <strong>${service.serviceName}</strong> x${service.quantity} = ${service.totalPrice} грн
                    <br><small>Дата: ${service.date}</small>
                </div>
            `).join('')}
        `;
    } else {
        servicesDetails.innerHTML = '<p style="text-align: center; color: #666;">Додаткові послуги не надавалися</p>';
    }
    
    document.getElementById('resultSection').style.display = 'block';
    
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

window.addEventListener('load', () => {
    checkAuth();
    loadGuestsSelect();
});
function checkAuth() {
    if (!sessionStorage.getItem('isAuthenticated')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function getServices() {
    const services = localStorage.getItem('services');
    return services ? JSON.parse(services) : [];
}

function saveServices(services) {
    localStorage.setItem('services', JSON.stringify(services));
}

function getGuests() {
    const guests = localStorage.getItem('guests');
    return guests ? JSON.parse(guests) : [];
}

const servicePrices = {
    'breakfast': 200,
    'lunch': 350,
    'dinner': 400,
    'cleaning': 300,
    'laundry': 250,
    'transfer': 500,
    'spa': 800,
    'parking': 150
};

const serviceNames = {
    'breakfast': 'Сніданок',
    'lunch': 'Обід',
    'dinner': 'Вечеря',
    'cleaning': 'Додаткове прибирання',
    'laundry': 'Пральня',
    'transfer': 'Трансфер',
    'spa': 'SPA-процедури',
    'parking': 'Паркування'
};

function loadGuestsSelect() {
    const guests = getGuests();
    const select = document.getElementById('serviceGuestSelect');
    
    select.innerHTML = '<option value="">Оберіть клієнта</option>';
    
    guests.forEach((guest, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${guest.fullName} (Номер ${guest.room})`;
        select.appendChild(option);
    });
}

function displayServices() {
    const services = getServices();
    const servicesList = document.getElementById('servicesList');
    
    if (services.length === 0) {
        servicesList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Послуг ще не надано</p>';
        return;
    }
    
    servicesList.innerHTML = services.map((service, index) => `
        <div class="list-item">
            <h4>${service.guestName}</h4>
            <p><strong>Послуга:</strong> ${serviceNames[service.serviceType]}</p>
            <p><strong>Кількість:</strong> ${service.quantity}</p>
            <p><strong>Ціна за одиницю:</strong> ${service.price} грн</p>
            <p><strong>Загальна вартість:</strong> ${service.totalPrice} грн</p>
            <p><strong>Дата:</strong> ${service.date}</p>
            <div class="item-actions">
                <button class="btn-delete" onclick="deleteService(${index})">Видалити</button>
            </div>
        </div>
    `).join('');
}

document.getElementById('serviceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const guestIndex = document.getElementById('serviceGuestSelect').value;
    const guests = getGuests();
    const guest = guests[guestIndex];
    
    if (!guest) {
        alert('Оберіть клієнта!');
        return;
    }
    
    const serviceType = document.getElementById('serviceType').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const date = document.getElementById('serviceDate').value;
    
    if (!serviceType) {
        alert('Оберіть тип послуги!');
        return;
    }
    
    const price = servicePrices[serviceType];
    const totalPrice = price * quantity;
    
    const service = {
        guestName: guest.fullName,
        guestRoom: guest.room,
        serviceType: serviceType,
        serviceName: serviceNames[serviceType],
        quantity: quantity,
        price: price,
        totalPrice: totalPrice,
        date: date,
        createdAt: new Date().toISOString()
    };
    
    const services = getServices();
    services.push(service);
    saveServices(services);
    
    displayServices();
    this.reset();
    
    alert(`Послугу "${serviceNames[serviceType]}" успішно додано!\nВартість: ${totalPrice} грн`);
});

function deleteService(index) {
    if (confirm('Ви впевнені, що хочете видалити цю послугу?')) {
        const services = getServices();
        services.splice(index, 1);
        saveServices(services);
        displayServices();
    }
}

function setDateLimits() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const dateInput = document.getElementById('serviceDate');
    dateInput.setAttribute('min', oneMonthAgo.toISOString().split('T')[0]);
    dateInput.setAttribute('max', today.toISOString().split('T')[0]);
    dateInput.value = today.toISOString().split('T')[0];
}

window.addEventListener('load', () => {
    checkAuth();
    loadGuestsSelect();
    displayServices();
    setDateLimits();
});
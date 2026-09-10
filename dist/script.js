"use strict";
let contacts = [];
let currentLetter = null;
function checkName(name) {
    name = name.trim();
    if (name.length < 2) {
        alert('Имя должно быть не менее 2 символов');
        return false;
    }
    for (let i = 0; i < name.length; i++) {
        let char = name[i];
        if (!isLetter(char) && char !== ' ') {
            alert('Имя может содержать только буквы и пробелы');
            return false;
        }
    }
    return true;
}
function checkJob(job) {
    job = job.trim();
    if (job === '') {
        alert('Должность не может быть пустой');
        return false;
    }
    for (let i = 0; i < job.length; i++) {
        let char = job[i];
        if (!isLetter(char) && char !== ' ') {
            alert('Должность может содержать только буквы и пробелы');
            return false;
        }
    }
    return true;
}
function checkPhone(phone) {
    let digits = '';
    for (let i = 0; i < phone.length; i++) {
        if (phone[i] >= '0' && phone[i] <= '9') {
            digits += phone[i];
        }
    }
    if (digits.length !== 11) {
        alert('Телефон должен содержать 11 цифр (например, 79123456789)');
        return false;
    }
    if (digits[0] !== '7' && digits[0] !== '8') {
        alert('Телефон должен начинаться с 7 или 8');
        return false;
    }
    return digits;
}
function isLetter(char) {
    return char.toLowerCase() !== char.toUpperCase();
}
loadContacts();
function updateUI() {
    saveContacts();
    render();
    renderAlphabet();
}
function addContact(name, job, phone) {
    if (!checkName(name))
        return;
    if (!checkJob(job))
        return;
    const normalizedPhone = checkPhone(phone);
    if (!normalizedPhone)
        return;
    const newContact = {
        id: Date.now(),
        name: name.trim(),
        job: job.trim(),
        phone: normalizedPhone
    };
    contacts.push(newContact);
    updateUI();
}
function render() {
    let filteredContacts = [];
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (currentLetter === null || firstLetter === currentLetter) {
            filteredContacts.push(contacts[i]);
        }
    }
    const container = document.getElementById('contactsList');
    if (!container) {
        console.error('Не найден элемент контейнера для контактов');
        return;
    }
    container.innerHTML = '';
    filteredContacts.forEach((contact) => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        const nameP = document.createElement('p');
        nameP.className = 'contact-name';
        nameP.textContent = contact.name;
        const jobP = document.createElement('p');
        jobP.className = 'contact-job';
        jobP.textContent = contact.job;
        const phoneP = document.createElement('p');
        phoneP.className = 'contact-phone';
        phoneP.textContent = contact.phone;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', () => deleteContact(contact.id));
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.addEventListener('click', () => editContact(contact.id));
        card.appendChild(nameP);
        card.appendChild(jobP);
        card.appendChild(phoneP);
        card.appendChild(deleteBtn);
        card.appendChild(editBtn);
        container.appendChild(card);
    });
}
render();
const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
function renderAlphabet() {
    const container = document.getElementById('alphabet');
    if (!container) {
        console.error('Не найден элемент контейнера для алфавита');
    }
    else {
        container.innerHTML = '';
        const allBtn = document.createElement('button');
        allBtn.textContent = `Все (${contacts.length})`;
        if (currentLetter === null) {
            allBtn.classList.add('active');
        }
        allBtn.addEventListener('click', function () {
            currentLetter = null;
            render();
            renderAlphabet();
        });
        container.appendChild(allBtn);
        for (let i = 0; i < alphabet.length; i++) {
            const letter = alphabet[i];
            let count = 0;
            for (let j = 0; j < contacts.length; j++) {
                const firstLetter = contacts[j].name.charAt(0).toUpperCase();
                if (firstLetter === letter) {
                    count++;
                }
            }
            const button = document.createElement('button');
            button.textContent = `${letter} (${count})`;
            if (currentLetter === letter) {
                button.classList.add('active');
            }
            button.addEventListener('click', function () {
                currentLetter = currentLetter === letter ? null : letter;
                render();
                renderAlphabet();
            });
            container.appendChild(button);
        }
    }
}
renderAlphabet();
function openModal(content) {
    const overlay = document.getElementById('modalOverlay');
    const body = document.getElementById('modalBody');
    if (!overlay || !body) {
        console.error('Не найден элемент модального окна');
        return;
    }
    body.innerHTML = content;
    overlay.style.display = 'flex';
}
function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) {
        console.error('Не найден элемент модального окна');
        return;
    }
    overlay.style.display = 'none';
}
const addBtn = document.getElementById('addBtn');
if (!addBtn) {
    console.error('Не найден элемент кнопки добавления контакта');
}
else {
    addBtn.addEventListener('click', function () {
        const nameInput = document.getElementById('nameInput');
        const jobInput = document.getElementById('positionInput');
        const phoneInput = document.getElementById('phoneInput');
        if (!nameInput || !jobInput || !phoneInput) {
            console.error('Не найден один из элементов ввода');
            return;
        }
        const name = nameInput.value;
        const job = jobInput.value;
        const phone = phoneInput.value;
        if (name !== '' && job !== '' && phone !== '') {
            addContact(name, job, phone);
            nameInput.value = '';
            jobInput.value = '';
            phoneInput.value = '';
        }
        else {
            alert('Заполни поля!');
        }
    });
}
const deleteAllBtn = document.getElementById('deleteAllBtn');
if (!deleteAllBtn) {
    console.error('Не найден элемент кнопки удаления всех контактов');
}
else {
    deleteAllBtn.addEventListener('click', function () {
        if (confirm('Удалить все контакты?')) {
            contacts = [];
            updateUI();
        }
    });
}
function deleteContact(id) {
    let index = -1;
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].id === id) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        contacts.splice(index, 1);
        updateUI();
    }
}
function editContact(id) {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].id === id) {
            const contact = contacts[i];
            const modalContent = document.createElement('div');
            modalContent.innerHTML = `
                <h2>✏️ Редактировать контакт</h2>
                <input type="text" id="editName" value="${contact.name}" placeholder="Имя">
                <input type="text" id="editJob" value="${contact.job}" placeholder="Должность">
                <input type="text" id="editPhone" value="${contact.phone}" placeholder="Телефон">
                <div class="btn-group">
                    <button class="btn-secondary" id = "cancelBtn">Отмена</button>
                    <button class="btn-primary" id="saveBtn">Сохранить</button>
                </div> `;
            openModal(modalContent.innerHTML);
            const saveBtn = document.getElementById('saveBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', function () {
                    saveEdit(id);
                });
            }
            const cancelBtn = document.getElementById('cancelBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function () {
                    closeModal();
                });
            }
            return;
        }
    }
}
function saveEdit(id) {
    const nameInput = document.getElementById('editName');
    const jobInput = document.getElementById('editJob');
    const phoneInput = document.getElementById('editPhone');
    const name = nameInput.value;
    const job = jobInput.value;
    const phone = phoneInput.value;
    if (!checkName(name))
        return;
    if (!checkJob(job))
        return;
    const normalizedPhone = checkPhone(phone);
    if (!normalizedPhone)
        return;
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].id === id) {
            contacts[i].name = name.trim();
            contacts[i].job = job.trim();
            contacts[i].phone = normalizedPhone;
            break;
        }
    }
    updateUI();
    closeModal();
}
const searchBtn = document.getElementById('searchBtn');
if (!searchBtn) {
    console.error('Не найден элемент кнопки поиска');
}
else {
    searchBtn.addEventListener('click', function () {
        const modalContent = document.createElement('div');
        modalContent.innerHTML = `
        <h2>🔍 Поиск контактов</h2>
        <input type="text" id="searchInput" placeholder="Введите имя, должность или телефон...">
        <div class="btn-group">
            <button class="btn-secondary" onclick="closeModal()">Закрыть</button>
            <button class="btn-primary" onclick="searchContacts()">Найти</button>
            <button class="btn-secondary" onclick="resetSearch()">Сбросить</button>
        </div>
        <div id="searchResults" class="search-results"></div>
    `;
        openModal(modalContent.innerHTML);
        const findBtn = document.getElementById('findsearchBtn');
        if (findBtn) {
            findBtn.addEventListener('click', function () {
                searchContacts();
            });
        }
        const resetBtn = document.getElementById('resetsearchBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetSearch();
            });
        }
        const closeBtn = document.getElementById('closesearchBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                closeModal();
            });
        }
    });
}
function searchContacts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase();
    const results = [];
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        if (contact.name.toLowerCase().includes(query) ||
            contact.job.toLowerCase().includes(query) ||
            contact.phone.toLowerCase().includes(query)) {
            results.push(contact);
        }
    }
    const container = document.getElementById('searchResults');
    if (!container) {
        console.error('Не найден элемент контейнера для результатов поиска');
        return;
    }
    container.innerHTML = '';
    if (results.length === 0) {
        container.innerHTML = '<p>Ничего не найдено</p>';
        return;
    }
    for (let i = 0; i < results.length; i++) {
        const contact = results[i];
        container.innerHTML += `
            <div class="result-item">
                <span class="result-name">${contact.name}</span>
                <span>${contact.job}</span>
                <span>${contact.phone}</span>
            </div>
        `;
    }
}
function resetSearch() {
    const input = document.getElementById('searchInput');
    if (!input) {
        console.error('Не найден элемент поля ввода поиска');
        return;
    }
    input.value = '';
    const results = document.getElementById('searchResults');
    if (!results) {
        console.error('Не найден элемент контейнера для результатов поиска');
        return;
    }
    results.innerHTML = '';
}
const closeModalBtn = document.getElementById('closeModalBtn');
if (!closeModalBtn) {
    console.error('Не найден элемент кнопки закрытия модального окна');
}
else {
    closeModalBtn.addEventListener('click', closeModal);
}
const overlay = document.getElementById('modalOverlay');
if (!overlay) {
    console.error('Не найден элемент оверлея модального окна');
}
else {
    overlay.addEventListener('click', function (event) {
        if (event.target === this) {
            closeModal();
        }
    });
}
function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}
function loadContacts() {
    const data = localStorage.getItem('contacts');
    if (!data) {
        return;
    }
    try {
        const saved = JSON.parse(data);
        if (!Array.isArray(saved)) {
            console.error('Загруженные данные не являются массивом контактов');
            return;
        }
        contacts = [];
        for (let i = 0; i < saved.length; i++) {
            const item = saved[i];
            if (typeof item === 'object' &&
                item !== null &&
                typeof item.id === 'number' &&
                typeof item.name === 'string' &&
                typeof item.job === 'string' &&
                typeof item.phone === 'string') {
                contacts.push(item);
            }
            else {
                console.error('Некорректный объект контакта в LocalStorage:', item);
            }
        }
    }
    catch (error) {
        console.error('Ошибка при загрузке контактов из LocalStorage:', error);
        contacts = [];
    }
}

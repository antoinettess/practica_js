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
    return true;
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
    if (!checkPhone(phone))
        return;
    const newContact = {
        id: Date.now(),
        name: name.trim(),
        job: job.trim(),
        phone: phone
    };
    contacts.push(newContact);
    updateUI();
}
function render() {
    let filteredContacts = [];
    for (let i = 0; i < contacts.length; i++) {
        if (currentLetter === null || contacts[i].name[0].toUpperCase() === currentLetter) {
            filteredContacts.push(contacts[i]);
        }
    }
    const container = document.getElementById('contactsList');
    container.innerHTML = '';
    filteredContacts.forEach(function (contact) {
        container.innerHTML +=
            `<div class='contact-card'>
        <p class='contact-name'>${contact.name}</p>
        <p class='contact-job'>${contact.job}</p>
        <p class='contact-phone'>${contact.phone}</p>
        <button onclick="deleteContact(${contact.id})">🗑️</button>
        <button onclick="editContact(${contact.id})">✏️</button>
    </div>`;
    });
}
render();
const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
function renderAlphabet() {
    const container = document.getElementById('alphabet');
    container.innerHTML = '';
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        let count = 0;
        for (let j = 0; j < contacts.length; j++) {
            if (contacts[j].name[0].toUpperCase() === letter) {
                count++;
            }
        }
        const button = document.createElement('button');
        button.textContent = `${letter} (${count})`;
        button.addEventListener('click', function () {
            currentLetter = letter;
            render();
        });
        container.appendChild(button);
    }
}
renderAlphabet();
function openModal(content) {
    const overlay = document.getElementById('modalOverlay');
    const body = document.getElementById('modalBody');
    body.innerHTML = content;
    overlay.style.display = 'flex';
}
function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.style.display = 'none';
}
const addBtn = document.getElementById('addBtn');
addBtn.addEventListener('click', function () {
    const nameInput = document.getElementById('nameInput');
    const jobInput = document.getElementById('positionInput');
    const phoneInput = document.getElementById('phoneInput');
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
const deleteAllBtn = document.getElementById('deleteAllBtn');
deleteAllBtn.addEventListener('click', function () {
    if (confirm('Удалить все контакты?')) {
        contacts = [];
        updateUI();
    }
});
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
            const html = `
                <h2>✏️ Редактировать контакт</h2>
                <input type="text" id="editName" value="${contact.name}" placeholder="Имя">
                <input type="text" id="editJob" value="${contact.job}" placeholder="Должность">
                <input type="text" id="editPhone" value="${contact.phone}" placeholder="Телефон">
                <div class="btn-group">
                    <button class="btn-secondary" onclick="closeModal()">Отмена</button>
                    <button class="btn-primary" onclick="saveEdit(${contact.id})">Сохранить</button>
                </div>
            `;
            // Открываем модальное окно с этой формой
            openModal(html);
            return; // выходим, чтобы не искать дальше
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
    if (!checkPhone(phone))
        return;
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].id === id) {
            contacts[i].name = name.trim();
            contacts[i].job = job.trim();
            contacts[i].phone = phone;
            break;
        }
    }
    updateUI();
    closeModal();
}
document.getElementById('searchBtn').addEventListener('click', function () {
    const html = `
        <h2>🔍 Поиск контактов</h2>
        <input type="text" id="searchInput" placeholder="Введите имя, должность или телефон...">
        <div class="btn-group">
            <button class="btn-secondary" onclick="closeModal()">Закрыть</button>
            <button class="btn-primary" onclick="searchContacts()">Найти</button>
            <button class="btn-secondary" onclick="resetSearch()">Сбросить</button>
        </div>
        <div id="searchResults" class="search-results"></div>
    `;
    openModal(html);
});
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
    input.value = '';
    const results = document.getElementById('searchResults');
    results.innerHTML = '';
}
const closeModalBtn = document.getElementById('closeModalBtn');
closeModalBtn.addEventListener('click', closeModal);
const overlay = document.getElementById('modalOverlay');
overlay.addEventListener('click', function (event) {
    if (event.target === this) {
        closeModal();
    }
});
function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}
function loadContacts() {
    const data = localStorage.getItem('contacts');
    if (data) {
        const saved = JSON.parse(data);
        contacts = [];
        for (let i = 0; i < saved.length; i++) {
            contacts.push(saved[i]);
        }
    }
}
window.deleteContact = deleteContact;
window.editContact = editContact;
window.saveEdit = saveEdit;
window.closeModal = closeModal;
window.searchContacts = searchContacts;
window.resetSearch = resetSearch;

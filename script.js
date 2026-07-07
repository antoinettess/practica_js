let contacts = [];
let nextId = 1;

loadContacts()

function addContact(name, job, phone){
   const newContact = {
    id : nextId,
    name : name,
    job : job,
    phone : phone
   };

 contacts.push(newContact);
 nextId++;
 saveContacts()
}


function render(){
   const container = document.getElementById('contactsList');
   container.innerHTML = '';
   contacts.forEach(function(contact){
    container.innerHTML +=
    `<div class='contact-card'>
        <p class='contact-name'>${contact.name}</p>
        <p class='contact-job'>${contact.job}</p>
        <p class='contact-phone'>${contact.phone}</p>
        <button onclick="deleteContact(${contact.id})">🗑️</button>
        <button onclick="editContact(${contact.id})">✏️</button>
    </div>`
   }) 
}
render()

const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

function renderAlphabet(){
    const container = document.getElementById('alphabet');
    container.innerHTML='';

    for(let i = 0; i< alphabet.length; i++){
        const letter = alphabet[i]
        let count = 0;

        for(let j = 0; j< contacts.length;j++){
            if(contacts[j].name[0].toUpperCase()===letter){
                count++
            }
        }
        container.innerHTML += `<button>${letter} (${count})</button>`;
    }
}
renderAlphabet();


document.getElementById('addBtn').addEventListener('click', function(){
    const name = document.getElementById('nameInput').value;
    const job = document.getElementById('positionInput').value;
    const phone = document.getElementById('phoneInput').value;

    if(name !== '' && job !== '' && phone !== ''){
        addContact(name, job, phone)

        document.getElementById('nameInput').value = '';
        document.getElementById('positionInput').value = '';
        document.getElementById('phoneInput').value = '';
       
        render();
        renderAlphabet();
        saveContacts()
    }else{
        alert('Заполни поля!')
    } 
})

document.getElementById('deleteAllBtn').addEventListener('click', function(){
   contacts = []
   saveContacts()
   render()
   renderAlphabet() 
});

function deleteContact(id){
    let index = -1;
    for( let i = 0; i < contacts.length; i++){
        if(contacts[i].id === id){
            index = i;
            break
        }
    }

    if(index !== -1){
        contacts.splice(index, 1);
        saveContacts()
        render();
        renderAlphabet();
    }
}


function editContact(id) {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].id === id) {
            const contact = contacts[i];
            
            const newName = prompt('Введите новое имя:', contact.name);
            if (newName !== null && newName !== '') {
                contact.name = newName;
            }
            const newJob  = prompt('Введите новую должность:', contact.job);
            if(newJob !== null && newJob !== ''){
                contact.job = newJob;
            }
            const newPhone  = prompt('Введите новый телфон:', contact.phone);
            if(newPhone !== null && newPhone !== ''){
                contact.phone = newPhone;
        }
       saveContacts()
       render();
       renderAlphabet();
       return;
    }
  }
}


document.getElementById('searchBtn').addEventListener('click', function(){
  const query = prompt('Введите свои данные') 
  if( query === null || query ===''){
    return
  } 
  const results = []
  for (let i = 0; i< contacts.length; i++){
    const contact = contacts[i]
    if(contact.name.includes(query) ||
       contact.job.includes(query) ||
       contact.phone.includes(query)) {
       results.push(contact);
  }
}

const container = document.getElementById('contactsList')
container.innerHTML = ''

if(results.length ===0){
    return
}

for(let i =0; i < results.length; i++){
    const contact = results[i]
    container.innerHTML+=`
    <div class="contact-card">
                <p class="contact-name">${contact.name}</p>
                <p class="contact-job">${contact.job}</p>
                <p class="contact-phone">${contact.phone}</p>
                <button onclick="deleteContact(${contact.id})">🗑️ Удалить</button>
                <button onclick="editContact(${contact.id})">✏️ Редактировать</button>
            </div>`
}
})

function saveContacts(){
    localStorage.setItem('contacts', JSON.stringify(contacts))
}
function loadContacts() {
    const data = localStorage.getItem('contacts');
    if (data) {
        const saved = JSON.parse(data);
        for (let i = 0; i < saved.length; i++) {
            contacts.push(saved[i]);
        }
        if (contacts.length > 0) {
            nextId = contacts[contacts.length - 1].id + 1;
        }
    }
}

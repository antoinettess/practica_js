interface Contact{
    id: number;
    name: string;
    job: string;
    phone: string;
}

let contacts: Contact[] = [];
let currentLetter: string | null = null


function checkName(name: string): boolean{
    name = name.trim()
    if(name.length < 2){
        alert('Имя должно быть не менее 2 символов')
        return false
    }
    for (let i = 0; i < name.length; i++) {
        let char = name[i];
        if (!isLetter(char) && char !== ' ') {
            alert('Имя может содержать только буквы и пробелы');
            return false;
        }
    }
    return true
}

function checkJob(job: string): boolean{
    job = job.trim()
    if(job ===''){
        alert('Должность не может быть пустой')
        return false
    }
    for(let i=0; i< job.length; i++){
        let char = job[i]
        if(!isLetter(char) && char !== ' '){
            alert('Должность может содержать только буквы и пробелы')
            return false
        }
    }
    return true
}

function checkPhone(phone: string): string | false{
    let digits = ''
    for(let i = 0; i< phone.length; i++){
        if(phone[i] >= '0' && phone[i] <= '9'){
            digits += phone[i]
        }
    }
    if(digits.length !== 11){
        alert('Телефон должен содержать 11 цифр (например, 79123456789)')
        return false
    }
     if (digits[0] !== '7' && digits[0] !== '8'){
        alert('Телефон должен начинаться с 7 или 8')
        return false
     }
    return digits
}

function isLetter(char: string): boolean{
    return char.toLowerCase() !== char.toUpperCase()
}

loadContacts()

function updateUI(): void {
    saveContacts();
    render()
    renderAlphabet();
}

function addContact (name: string, job: string, phone: string): void {
    
    if (!checkName(name)) return;
    if (!checkJob(job)) return;
    
    const normalizedPhone = checkPhone(phone) 
    if(!normalizedPhone) return
    
    const newContact: Contact = {
        id: Date.now(),
        name: name.trim(),
        job: job.trim(),
        phone: normalizedPhone 
    };

    contacts.push(newContact);
    updateUI();
}


function render(): void{
    
  
    let filteredContacts: Contact[] = []
   for( let i = 0; i < contacts.length; i++){
    const contact = contacts[i]
    const firstLetter = contact.name.charAt(0).toUpperCase()
    if(currentLetter === null || firstLetter === currentLetter){
        filteredContacts.push(contacts[i])
    }
   }

   
   const container = document.getElementById('contactsList') 
   if(!container){
    console.error('Не найден элемент контейнера для контактов')
   return
   }
   container.innerHTML = ''
    
    filteredContacts.forEach((contact: Contact) => {
        const card = document.createElement('div')
        card.className = 'contact-card'

        const nameP = document.createElement('p')
        nameP.className = 'contact-name'
        nameP.textContent = contact.name

        const jobP = document.createElement('p')
        jobP.className = 'contact-job'
        jobP.textContent = contact.job

        const phoneP = document.createElement('p')
        phoneP.className = 'contact-phone'
        phoneP.textContent = contact.phone

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = '🗑️'
        deleteBtn.addEventListener('click', () => deleteContact(contact.id))

        const editBtn = document.createElement('button')
        editBtn.textContent = '✏️'
        editBtn.addEventListener('click', () => editContact(contact.id))

        card.appendChild(nameP)
        card.appendChild(jobP)
        card.appendChild(phoneP)
        card.appendChild(deleteBtn)
        card.appendChild(editBtn)
        container.appendChild(card)
      })
    }

render()



const alphabet: readonly string[] = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');


function renderAlphabet(): void{

    const container = document.getElementById('alphabet') 
    if(!container){
        console.error('Не найден элемент контейнера для алфавита')
    }else{
        container.innerHTML=''

        const allBtn = document.createElement('button')
        allBtn.textContent = `Все (${contacts.length})`
        if(currentLetter === null){
            allBtn.classList.add('active')
        }
        allBtn.addEventListener('click', function(){
            currentLetter = null;
            render()
            renderAlphabet()
        })
        container.appendChild(allBtn)
        

    for(let i = 0; i< alphabet.length; i++){
        const letter = alphabet[i]
        let count = 0;

        for(let j = 0; j< contacts.length;j++){
            const firstLetter = contacts[j].name.charAt(0).toUpperCase()
            if(firstLetter===letter){
                count++
            }
        }
       const button = document.createElement('button');
       button.textContent = `${letter} (${count})`
       if(currentLetter === letter){
        button.classList.add('active')
       }
       button.addEventListener('click' , function(){
        currentLetter = currentLetter === letter ? null : letter
        render();
        renderAlphabet()
    
    })
    container.appendChild(button)
}
}
}
renderAlphabet()
    


function openModal(content: string): void{
    const overlay = document.getElementById('modalOverlay')
    const body = document.getElementById('modalBody')

    if(!overlay || !body){
        console.error('Не найден элемент модального окна')
        return
    }

    body.innerHTML = content
    overlay.style.display = 'flex'
}

function closeModal(): void{
    const overlay = document.getElementById('modalOverlay') 
    if(!overlay){
        console.error('Не найден элемент модального окна')
        return
    }

    overlay.style.display = 'none'
}
const addBtn = document.getElementById('addBtn') 
if(!addBtn){
    console.error('Не найден элемент кнопки добавления контакта')
}else{
addBtn.addEventListener('click', function(){
    const nameInput = document.getElementById('nameInput') as HTMLInputElement
    const jobInput = document.getElementById('positionInput') as HTMLInputElement
    const phoneInput = document.getElementById('phoneInput') as HTMLInputElement
    
    if(!nameInput || !jobInput || !phoneInput){
        console.error('Не найден один из элементов ввода')
        return
    }

    const name = nameInput.value
    const job = jobInput.value
    const phone = phoneInput.value

    if(name !== '' && job !== '' && phone !== ''){
        addContact(name, job, phone)

        nameInput.value = ''
        jobInput.value = ''
        phoneInput.value = ''
       
        
    }else{
        alert('Заполни поля!')
    } 
  })
}

const deleteAllBtn = document.getElementById('deleteAllBtn')
if(!deleteAllBtn){
    console.error('Не найден элемент кнопки удаления всех контактов')
}else{
deleteAllBtn.addEventListener('click', function(){
    if (confirm('Удалить все контакты?')){
   contacts = []
   updateUI()
    }
  });
}

function deleteContact(id: number): void{
    let index = -1;
    for( let i = 0; i < contacts.length; i++){
        if(contacts[i].id === id){
            index = i;
            break
        }
    }

    if(index !== -1){
        contacts.splice(index, 1);
        updateUI();
    }
}


function editContact(id: number): void {
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
                </div> `

                openModal(modalContent.innerHTML);

                const saveBtn = document.getElementById('saveBtn') 
                if(saveBtn){
                    saveBtn.addEventListener('click', function() {
                        saveEdit(id)
                    })
                }
                const cancelBtn = document.getElementById('cancelBtn')
                if(cancelBtn){
                    cancelBtn.addEventListener('click', function() {
                        closeModal()
                    })
                }
                return
            }
        }
    }


            

function saveEdit(id: number): void{
    const nameInput = document.getElementById('editName') as HTMLInputElement
    const jobInput = document.getElementById('editJob') as HTMLInputElement
    const phoneInput = document.getElementById('editPhone') as HTMLInputElement

    const name: string = nameInput.value
    const job: string = jobInput.value
    const phone: string = phoneInput.value


    if (!checkName(name)) return;
    if (!checkJob(job)) return;
    
   const normalizedPhone = checkPhone(phone);
    if (!normalizedPhone) return;
  
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

const searchBtn = document.getElementById('searchBtn')
if(!searchBtn){
    console.error('Не найден элемент кнопки поиска')
}else{
    searchBtn.addEventListener ('click', function(){
   const modalContent = document.createElement('div')
    modalContent.innerHTML = `
        <h2>🔍 Поиск контактов</h2>
        <input type="text" id="searchInput" placeholder="Введите имя, должность или телефон...">
        <div class="btn-group">
            <button class="btn-secondary" id="closeModalBtn">Закрыть</button>
            <button class="btn-primary" id="findsearchBtn">Найти</button>
            <button class="btn-secondary" id="resetsearchBtn">Сбросить</button>
        </div>
        <div id="searchResults" class="search-results"></div>
    `;
    openModal(modalContent.innerHTML)

    const findBtn = document.getElementById('findsearchBtn')
    if(findBtn){
        findBtn.addEventListener('click', function(){
            searchContacts()
        })
    }

    const resetBtn = document.getElementById('resetsearchBtn')
    if(resetBtn){
        resetBtn.addEventListener('click', function(){
            resetSearch()
        })
    }

    const closeBtn = document.getElementById('closesearchBtn')
    if(closeBtn){
        closeBtn.addEventListener('click', function(){
            closeModal()
        })
    }
  })
}

function searchContacts(): void {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement
    const query = searchInput.value.toLowerCase()
    const results: Contact[] = []

    for(let i = 0; i < contacts.length;i++){
        const contact = contacts[i]
        if( contact.name.toLowerCase().includes(query) ||
            contact.job.toLowerCase().includes(query) ||
            contact.phone.toLowerCase().includes(query)){
                results.push(contact)
            }
    }

  const container = document.getElementById('searchResults') 
      if(!container){
        console.error('Не найден элемент контейнера для результатов поиска')
        return
      }
    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = '<p>Ничего не найдено</p>';
        return;
    }
    
    for (let i = 0; i < results.length; i++) {
        const contact = results[i];

        const card = document.createElement('div')
        card.className = 'result-item'

        const info = document.createElement('div')
        info.className = 'result-info'
        info.textContent = `${contact.name} | ${contact.job} | ${contact.phone}`

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = '🗑️'
        deleteBtn.className = 'result-delete-btn'
        deleteBtn.addEventListener('click', () => {
            deleteContact(contact.id)
            closeModal()
        })

        const editBtn = document.createElement('button')
        editBtn.textContent = '✏️'
        editBtn.className = 'result-edit-btn'
        editBtn.addEventListener('click', () => {
            editContact(contact.id)
           closeModal()
        })

        card.appendChild(info)
        card.appendChild(editBtn)
        card.appendChild(deleteBtn)
        container.appendChild(card)

    }
}

function resetSearch(): void {
    const input = document.getElementById('searchInput') as HTMLInputElement
    if(!input){
        console.error('Не найден элемент поля ввода поиска')
        return
    }
    input.value = ''
    const results = document.getElementById('searchResults') as HTMLDivElement
    if(!results){
        console.error('Не найден элемент контейнера для результатов поиска')
        return
    }
    results.innerHTML = ''
}

const closeModalBtn = document.getElementById('closeModalBtn') 
if(!closeModalBtn){
    console.error('Не найден элемент кнопки закрытия модального окна')
}else{
    closeModalBtn.addEventListener('click', closeModal)
}

    const overlay = document.getElementById('modalOverlay') as HTMLDivElement | null
    if(!overlay){
        console.error('Не найден элемент оверлея модального окна')
    
    }else{
    overlay.addEventListener('click', function(this: HTMLDivElement, event: MouseEvent) {
    if (event.target === this) {
        closeModal();
    }
});
    }

function saveContacts(): void{
    localStorage.setItem('contacts', JSON.stringify(contacts))
}
function loadContacts(): void {
    const data = localStorage.getItem('contacts')
    if(!data){
        return
    }

    try{
        const saved: Contact[] = JSON.parse(data)
        if(!Array.isArray(saved)){
            console.error('Загруженные данные не являются массивом контактов')
            return
        }
        contacts = []
        for(let i = 0; i < saved.length; i++){
            const item = saved[i]

            if(
                typeof item === 'object' &&
                item !== null &&
                typeof item.id === 'number' &&
                typeof item.name === 'string' &&
                typeof item.job === 'string' &&
                typeof item.phone === 'string'
            ){
                contacts.push(item as Contact)
            }else{
                console.error('Некорректный объект контакта в LocalStorage:', item)
            }
        }
    }catch(error){
        console.error('Ошибка при загрузке контактов из LocalStorage:', error)
        contacts = []
    }
    
}



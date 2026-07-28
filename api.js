 async function loadData(url, containerId){
    const container = document.getElementById(containerId)
    container.innerHTML = '<p style="color: #95066e;"> Загрузка...</p>'
    try{
        const response = await fetch(url)
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const limited = data.slice(0, 10)
        const container = document.getElementById(containerId)
        container.innerHTML = ''

        for(let i = 0; i < limited.length; i++){
            const item = limited[i]
            container.innerHTML += 
            `<div class="api-item">
                    <strong>${item.id}. ${item.name || item.title}</strong>
                </div>`
        }
        console.log(`Данные загружены из: ${url}`)
    
    } catch(error){
        console.error(`Ошибка при загрузке данных из ${url}:`, error.message)
        container.innerHTML = `<p style="color: red;"> Ошибка: ${error.message}</p>`;
    }
 }
    

loadData('https://jsonplaceholder.typicode.com/users', 'usersList');
loadData('https://jsonplaceholder.typicode.com/posts', 'postsList');
loadData('https://jsonplaceholder.typicode.com/albums', 'albumsList');
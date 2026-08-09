interface apiItem{
    id: number
    name: string
    title: string
}

async function loadData(url: string, containerId: string): Promise<void> {
    const container = document.getElementById(containerId) as HTMLDivElement
    container.innerHTML = '<p style="color: #95066e;"> Загрузка...</p>'
    try{
        const response = await fetch(url)
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: apiItem[] = await response.json()
        const limited: apiItem[] = data.slice(0, 10)
        container.innerHTML = ''

        for(let i = 0; i < limited.length; i++){
            const item = limited[i]
            container.innerHTML += 
            `<div class="api-item">
                    <strong>${item.id}. ${item.name || item.title}</strong>
                </div>`
        }
        console.log(`Данные загружены из: ${url}`)
    
    } catch(error: unknown){
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
        console.error(`Ошибка при загрузке данных из ${url}:`, errorMessage)
        container.innerHTML = `<p style="color: red;"> Ошибка: ${errorMessage}</p>`;
    }
 }
    

loadData('https://jsonplaceholder.typicode.com/users', 'usersList');
loadData('https://jsonplaceholder.typicode.com/posts', 'postsList');
loadData('https://jsonplaceholder.typicode.com/albums', 'albumsList');
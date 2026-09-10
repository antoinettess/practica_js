const API_URL = 'https://jsonplaceholder.typicode.com'

interface User{
    id: number
    name: string
    username: string
    email?: string
    phone?: string
}
interface Post{
    id: number
    title: string
    body?: string
    userId?: number
}
interface Album{
    id: number
    title: string
    userId?: number
}

async function loadData<T>(
    url: string, 
    containerId: string, 
     getDisplayName: (item: T) => string
    ): Promise<void> {
    const container = document.getElementById(containerId) as HTMLDivElement

    if(!container){
        console.log(`Контейнер ${containerId} не найден`)
        return
    }
    
    container.innerHTML = '<p style="color: #95066e;"> Загрузка...</p>'


    try{
        const response = await fetch(url)
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: T[] = await response.json()
        const limited: T[] = data.slice(0, 10)
        container.innerHTML = ''

        for(let i = 0; i < limited.length; i++){
            const item = limited[i] 
            const displayName = getDisplayName(item)
            const itemId = (item as {id: number}).id
            container.innerHTML += 
            `<div class="api-item">
                    <strong>${itemId}. ${displayName}</strong>
                </div>`
        }
        console.log(`Данные загружены из: ${url}`)
    
    } catch(error: unknown){
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
        console.error(`Ошибка при загрузке данных из ${url}:`, errorMessage)
        container.innerHTML = `<p style="color: red;"> Ошибка: ${errorMessage}</p>`;
    }
 }
    

loadData<User>(`${API_URL}/users`, 'usersList', (user: User) => user.name);
loadData<Post>(`${API_URL}/posts`, 'postsList' , (post: Post) => post.title);
loadData<Album>(`${API_URL}/albums`, 'albumsList', (album: Album) => album.title);
function loadData(url, containerData){
    fetch(url)
    .then(function(response){
        response.json().then(function(data){
            const limited = data.slice(0, 10)
            const container = document.getElementById(containerData)
            container.innerHTML = ''

            for(let i = 0; i<limited.length; i++){
                const item = limited[i]
                container.innerHTML = container.innerHTML + (item.name || item.title) + '<br>'
            }
        
                })
    })
    .catch(function(error){
        console.log('Ошибка')
    })
}

loadData('https://jsonplaceholder.typicode.com/users', 'usersList');
loadData('https://jsonplaceholder.typicode.com/posts', 'postsList');
loadData('https://jsonplaceholder.typicode.com/albums', 'albumsList');
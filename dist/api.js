"use strict";
const API_URL = 'https://jsonplaceholder.typicode.com';
async function loadData(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.log(`Контейнер ${containerId} не найден`);
        return;
    }
    container.innerHTML = '<p style="color: #95066e;"> Загрузка...</p>';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const limited = data.slice(0, 10);
        container.innerHTML = '';
        for (let i = 0; i < limited.length; i++) {
            const item = limited[i];
            const displayName = item.name || item.title || 'Без названия';
            container.innerHTML +=
                `<div class="api-item">
                    <strong>${item.id}. ${displayName}</strong>
                </div>`;
        }
        console.log(`Данные загружены из: ${url}`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        console.error(`Ошибка при загрузке данных из ${url}:`, errorMessage);
        container.innerHTML = `<p style="color: red;"> Ошибка: ${errorMessage}</p>`;
    }
}
loadData(`${API_URL}/users`, 'usersList');
loadData(`${API_URL}/posts`, 'postsList');
loadData(`${API_URL}/albums`, 'albumsList');

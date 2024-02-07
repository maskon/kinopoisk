const body = document.querySelector('body')
const imgSearch = document.getElementById('img-search')
const inputSearch = document.getElementById('input-search')
const genreFilter = document.getElementById('genre__filter')
const genreList = genreFilter.querySelectorAll('.genre__list')
const content = document.querySelector('.content__item')
const contentBtn = document.querySelector('#content__btn')
const error = document.querySelector('#error')
const modal = document.querySelector('#modal')
const burger = document.querySelector('#burger')
const headerMenu = document.querySelector('#header__menu')
const options = { headers: {accept: 'application/json', 'X-API-KEY': 'QP7MWPJ-HJSM4NS-PAW11N1-7ZSZ388'} }

// Поиск появление инпута
imgSearch.addEventListener('click', () => {
    if (headerMenu.classList.contains('active')) {
        inputSearch.classList.remove('active')
    } else {
        inputSearch.classList.toggle('active')
        inputSearch.focus()
    } 
})

// Бургер меню
burger.addEventListener('click', () => {
    headerMenu.classList.toggle('active')
    if (headerMenu.classList.contains('active')) {
        body.classList.add('no-scroll')
        burger.classList.add('active')
        inputSearch.classList.remove('active')
        
    } else {
        body.classList.remove('no-scroll')
        burger.classList.remove('active')
    }
})

let value
let filteredData
let id

async function getWeather(filter) {
    try {
        const url = await fetch('https://api.kinopoisk.dev/v1.4/movie/search?page=1&limit=100', options)
        const data = await url.json()
        const array = data.docs
        let filteredData = filter ? array.filter(arr => arr.name.toUpperCase().includes(filter.toUpperCase())) : array

        renderHTML()
        pagination()
        
        genreList.forEach( (item) => {
            item.addEventListener('click', (e) => {
                
                content.innerHTML = ''
                filteredData = []

                genreList.forEach( (item) => { item.classList.remove('active') })
                
                if (e.target.dataset.type === "action") {filterCategory('боевик'.toLowerCase()) }
    
                else if (e.target.dataset.type === "adventures") {filterCategory('Приключения'.toLowerCase()) }
                
                else if (e.target.dataset.type === "comedy") {filterCategory('Комедия'.toLowerCase()) }
                
                else if (e.target.dataset.type === "fantastic") {filterCategory('Фантастика'.toLowerCase()) }
                
                else if (e.target.dataset.type === "thriller") {filterCategory('Триллер'.toLowerCase()) }
                
                else if (e.target.dataset.type === "drama") {filterCategory('Драма'.toLowerCase()) }
                
                else if (e.target.dataset.type === "all") { e.target.classList.add('active'), filteredData = array, renderHTML(), pagination() }
                
                
                function filterCategory(genreCategory) {
                    e.target.classList.add('active')
                    filteredData = array.filter( (arr) => {
                        return arr.genres[0].name.includes(genreCategory)
                    })
                    renderHTML()
                    pagination()
                }
            }) 
        })
        
        // Отрисовка HTML на странице
        function renderHTML() { 
            for (let i = 0; i < filteredData.length; i++) {
                let genreNames = filteredData[i].genres.map(genre => genre.name).join(', ')
                id = i
                content.insertAdjacentHTML('afterbegin', `
                    <div class="content__box">
                        <div class="content__img">
                            <img src="${filteredData[i].poster.previewUrl}"id="${i}" class="content__img-el alt="">
                        </div>
                        <div class="content__reiting">${filteredData[i].internalRating.toFixed(1)}</div>
                        <div class="content__title content__inner">${filteredData[i].name}</div>
                        <div class="content__genre">${filteredData[i].year}, ${genreNames}</div>  
                    </div>
                `)
            } 
        }
        
        // Пагинация
        function pagination() {
            const contentBboxes = content.querySelectorAll('.content__box')
            contentBboxes.forEach( (item, index) => {
                index > 11 ? (item.style.display = 'none', contentBtn.classList.add('active')) : (item.style.display = 'block', contentBtn.classList.remove('active'))
                
                contentBtn.addEventListener('click', () => { item.style.display = 'block', contentBtn.classList.remove('active') })
            })
            if (contentBboxes.length === 0) {
                error.innerHTML = 'Ничего не найдено!'
                contentBtn.classList.remove('active')
            } else {
                error.innerHTML = ''
            }
        }
        
        // Модальное окно
        content.addEventListener('click', (e) => {
            if (e.target.classList.contains('content__img-el')) {
                modal.innerHTML = ''
                id = Number(e.target.id)
                let genreNames = filteredData[id].genres.map(genre => genre.name).join(', ')
                modal.classList.add('active')
                body.classList.add('no-scroll')
                modal.insertAdjacentHTML('afterbegin', 
                `<div class="modal__content">
                    <div class="modal__close">
                        <img src="img/close.png" id="close" alt="">
                    </div>
                    <img src="${filteredData[id].poster.previewUrl}" alt="">
                    <div class="modal__item">
                        <span class="modal__label">Название фильма:</span>
                        <span class="modal__title">${filteredData[id].name}</span>
                    </div>
                    <div class="modal__item">
                        <span class="modal__label">Дата выхода:</span>
                        <span class="modal__title">${filteredData[id].year}</span>
                    </div>
                    <div class="modal__item">
                        <span class="modal__label">Жанр:</span>
                        <span class="modal__title">${genreNames}</span>
                    </div>
                    <div class="modal__item">
                        <span class="modal__label">Возрастное ограничение:</span>
                        <span class="modal__title">${filteredData[id].ageRating}+</span>
                    </div>
                    <div class="modal__item">
                        <span class="modal__label">Рейтинг:</span>
                        <span class="modal__title">imdb: ${filteredData[id].rating.imdb.toFixed(1)}</span>
                        <span class="modal__title modal__title--kp">kp: ${filteredData[id].rating.kp.toFixed(1)}</span>
                    </div>
                </div>`)
            }

            const modalContent = modal.querySelector('.modal__content')
            const close = modal.querySelector('#close')
            
            setTimeout( () => {
                modalContent.style.transform = 'scale(1)'
            },0)
            
            close.addEventListener('click', () => {
                modalContent.style.transform = 'scale(0)'
                setTimeout( () => {
                    
                    modal.classList.remove('active')
                    body.classList.remove('no-scroll')
                     
                },400)
            })
        })
 
    } catch (err) {
        console.error(err)
    }
}

// Поиск
inputSearch.addEventListener('input', () => {
    content.innerHTML = ''
    value = inputSearch.value
    getWeather(value)
})

getWeather()
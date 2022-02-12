import Characters from '../controller/characters'
import Comic from '../controller/comic'


class App {
    constructor() {
        this.limit = 50;
        this.showMoreMarvelComics = false;
        this.beSearch = false;
        this.elementSearch;
        this.getHtmlElements();
        this.initApp();

    }
    getHtmlElements() {
        //Pages
        this.numberPage = document.getElementsByClassName('page-link');

        //Show total results
        this.divTotal = document.getElementById('total');

        //Main body
        this.divImgs = document.getElementById('imgs');
        this.imgHeros = document.getElementsByClassName('imgHero')

        //Modal Elements
        /**Show characater info */
        this.modalCharacterName = document.getElementById('characterName');
        this.modalCharacterImg = document.getElementById('imgCharacter');
        this.modalCharacterDescrition = document.getElementById('descrition');
        /**Show Comics */
        this.modalCharacterComic = document.getElementById('characterComic');
        /**Show when have more than 3 comics */
        this.modalCharacterMoreComics = document.getElementById('characterMoreComics');
        this.modalBtnMoreComics = document.getElementById('moreComics');

        //Input character search
        this.inputSearch = document.getElementById('searchCharacter');

        // Buttons
        /**Changes the amount of results on the screen*/
        this.btnCharactersResults = document.getElementsByClassName('results');
        /**Finds character*/
        this.btnSearch = document.getElementById('button-addon2');
        /**Changes Page*/
        this.btnPage = document.querySelector('.pagination');
        /**Back init */
        this.btnMarvelInit = document.getElementById('marvelHeader');
    };
    async initApp() {

        const heros = await Characters.getResults(0, this.limit);
        this.shownCharactersResults();
        this.showCharacters(heros.results);
        this.page(heros.total);
        this.divTotal.innerHTML = `<p>Total characters ${heros.total}</p>`;
        this.search()
        this.beSearch = false;
        this.btnMarvelInit.onclick = () => this.initApp();


    };
    async newPage(offset = 0) {
        if (!this.beSearch) {
            const heros = await Characters.getResults(offset, this.limit);
            this.showCharacters(heros.results);
        } else {
            const heros = await Characters.getSearch(this.elementSearch, this.limit, offset);
            this.showCharacters(heros.results);
        };
    };
    showCharacters(data) {
        /**clean main body*/
        this.divImgs.innerHTML = ``;
        /**save position */
        let counter = 0;

        data.forEach(element => {
            let img;
            if (element.thumbnail.path != "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" && element.thumbnail.path != 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708') {
                img = `<a href="#" data-bs-toggle="modal" data-bs-target="#marvelCharacterModal" class="imgHero"><img data-position="${counter}" width="10vw" height="100px" src="${element.thumbnail.path}.${element.thumbnail.extension}" title="${element.name}" alt="${element.name}"/></a>`
            } else {
                img = `<a href="#" data-bs-toggle="modal" data-bs-target="#marvelCharacterModal" class="imgHero"><img data-position="${counter}"width="10vw" height="100px" src="/img/marvel.png" title="${element.name}" alt="${element.name}"/></a>`
            };

            this.divImgs.innerHTML += `${img} `;
            counter++;
        });

        for (const hero of this.imgHeros) {
            hero.onclick = event => {
                const index = event.target.dataset.position;
               this.showModal(data[index]);
            }
        }
    };

    showModal(data) {
        console.log(data)
        gtag("event", "hero", {
                    value: `${data.name}`
        });
        //character info
        this.modalCharacterName.innerHTML = `${data.name}`;
        this.modalCharacterImg.innerHTML = `<img class="imgHero" width="180px" src="${data.thumbnail.path}.${data.thumbnail.extension}" title="${data.name}" alt="${data.name}"/>`;
        this.modalCharacterDescrition.innerHTML = `${data.description}`;
        //comic info
        this.getCharacterComics(data.comics.items);
        this.modalBtnMoreComics.onclick = () => this.showMoreComic();

    }

    getCharacterComics(comics) {
        console.log(comics.length > 3)
        comics.length > 3 ? this.modalBtnMoreComics.style.display = `flex` : this.modalBtnMoreComics.style.display = `none`;
        let counter = 0;
        this.modalCharacterComic.innerHTML = ``;
        this.modalCharacterMoreComics.innerHTML = ``;
        this.modalCharacterMoreComics.style.display = `none`;
        this.modalBtnMoreComics.innerHTML = `+`
        this.showMoreMarvelComics = false;
        comics.forEach(async element => {
            const comicInfo = await Comic.getComic(element.resourceURI)
            if (counter < 3) {
                this.showComic(comicInfo.results[0]);
            } else {
                this.moreComic(comicInfo.results[0]);
            };
            counter++;
        });

    };

    showComic(results) {
        this.modalCharacterComic.innerHTML += `<div class="imgComics">
                                                    <h6>${results.title}</h6>
                                                    <img src="${results.thumbnail.path}.${results.thumbnail.extension}" alt=" Imagem${results.title}">
                                                </div>`;
    }
    moreComic(results) {

        this.modalCharacterMoreComics.innerHTML += `<div class="imgComics">
                                                        <h6>${results.title}</h6>
                                                        <img src="${results.thumbnail.path}.${results.thumbnail.extension}" alt="Imagem ${results.title}">
                                                    </div>`;
    };

    showMoreComic() {
        console.log(`moreComics`)
        if (this.showMoreMarvelComics) {
            this.modalCharacterMoreComics.style.display = `none`;
            this.modalBtnMoreComics.innerHTML = `+`;
        } else {
            this.modalCharacterMoreComics.style.display = `flex`;
            this.modalBtnMoreComics.innerHTML = `-`;
        }

        this.showMoreMarvelComics = !this.showMoreMarvelComics;
    };



    //Button change page
    page(total) {
        const pages = Math.round(total / this.limit);
        this.btnPage.innerHTML = ``;
        if (pages === 1) {
            return;
        };
        for (let index = 1; index < pages + 1; index++) {
            const li = ` <li class="page-item"><a class="page-link" href="#" data-page="${index}">${index}</a></li>`;
            this.btnPage.innerHTML += li;
        };

        for (const link of this.numberPage) {
            link.onclick = event => {
                const pageN = event.target.dataset.page;
                const offset = ((parseInt(pageN) - 1) * this.limit);
                this.newPage(offset);
            };
        };
    };

    shownCharactersResults() {
        for (const btnResult of this.btnCharactersResults) {
            btnResult.onclick = () => {
                const number = parseInt(btnResult.innerHTML);
                if (this.limit != number) {
                    this.limit = number;
                    this.initApp();
                };
            };
        };
        for (const btnResult of this.btnCharactersResults) {
            if (this.limit === parseInt(btnResult.innerHTML)) {
                btnResult.style.color = `grey`;
                btnResult.style.cursor = `not-allowed`;
            } else {
                btnResult.style.color = `blue`;
                btnResult.style.cursor = `pointer`;
            };
        };
    };

    search() {
        this.btnSearch.onclick = () => {
            this.elementSearch = this.inputSearch.value;
            this.searchCharacterInit(this.elementSearch);
        };

    };
    async searchCharacterInit(name) {
        const heros = await Characters.getSearch(name, this.limit, 0);
        this.showCharacters(heros.results);
        this.page(heros.total);
        this.divTotal.innerHTML = `<p>Total characters ${heros.total}</p>`;
        this.beSearch = true;
    };


};


export default new App();

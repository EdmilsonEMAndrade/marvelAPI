import Characters from './controller/characters'
import Comic from './controller/comic'


class App {
    constructor() {
        this.initApp();
        this.btnPage = document.querySelector('.pagination');
        this.links = document.getElementsByClassName('page-link');
        this.divImgs = document.getElementById('imgs');
        this.imgHeros = document.getElementsByClassName('imgHero');
        this.modal = document.getElementById('marvelCharacterModal');
        this.divTotal = document.getElementById("total");
        this.btnResults = document.getElementsByClassName("results");
        this.btnSearch = document.getElementById("button-addon2");
        this.inputSearch = document.getElementById("searchCharacter")
        this.limit = 50;
        this.showMoreHq = false;
    }

    showMoreComic() {
        if (this.showMoreHq) {
            document.getElementById('more-modal-body').style.display = `none`;
            document.getElementById('more').innerHTML = `+`
        } else {
            document.getElementById('more-modal-body').style.display = `flex`;
            document.getElementById('more').innerHTML = `-`
        }

        this.showMoreHq = !this.showMoreHq;
    };

    async initApp() {
        const heros = await Characters.getResults(0, this.limit);
        this.results();
        this.showCharacters(heros.results);
        this.page(heros.total);
        this.divTotal.innerHTML = `<p>Total characters ${heros.total}</p>`;
        this.search()
    };

    async searchCharacterInit(name) {
        const heros = await Characters.getSearch(name, this.limit);
        this.showCharacters(heros.results);
        this.page(heros.results.length);
        this.divTotal.innerHTML = `<p>Total characters ${heros.results.length}</p>`;
        this.search()
    };

    search() {
        this.btnSearch.onclick = () => {
            this.searchCharacterInit(this.inputSearch.value);
        };
        this.btnSearch.onkeypress = () => {
            this.searchCharacterInit(this.inputSearch.value);
        };
    };

    getCharacterComics(comics) {
        let counter = 0
        document.getElementById('more').style.display = `none`
        comics.forEach(async element => {
            const hq = await Comic.getComic(element.resourceURI)
            if (counter < 3) {
                this.showComic(hq.results[0]);
            } else {
                this.moreComic(hq.results[0]);
            };
            counter++;
            if (counter > 3) {
                document.getElementById('more').style.display = `flex`
            }
        });
    };

    async newPage(offset = 0) {
        const personagem = await Characters.getResults(offset, this.limit);
        this.showCharacters(personagem.results);
    };
    showCharacters(data) {
        this.divImgs.innerHTML = ``;
        let counter = 0;
        data.forEach(element => {
            let img;
            if (element.thumbnail.path != "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" && element.thumbnail.path != 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708') {
                img = `<a href="#" data-bs-toggle="modal" data-bs-target="#marvelCharacterModal"><img class="imgHero" data-position="${counter}" width="10vw" height="100px" src="${element.thumbnail.path}.${element.thumbnail.extension}" title="${element.name}" alt="${element.name}"/></a>`
            } else {
                img = `<a href="#" data-bs-toggle="modal" data-bs-target="#marvelCharacterModal"><img class="imgHero" data-position="${counter}"width="10vw" height="100px" src="/img/marvel.png" title="${element.name}" alt="${element.name}"/></a>`
            };

            this.divImgs.innerHTML += `${img} `;
            counter++;

        });
        for (const hero of this.imgHeros) {
            hero.onclick = event => {
                let index = event.target.dataset.position;
                let comics = data[index].comics.items;
                this.showMoreHq = false;

                document.getElementById("modal-body").innerHTML = '';

                this.modal.innerHTML = `<div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${data[index].name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body d-flex justify-content-center">
                  <img class="imgHero" width="180px" src="${data[index].thumbnail.path}.${data[index].thumbnail.extension}" title="${data[index].name}" alt="${data[index].name}"/>
                  </div>
                  <div class="modal-body">
                  ${data[index].description}
                  </div>
                  <hr><h5 class="modal-title" id="exampleModalLabel">HQs</h5>
                  <div id="modal-body">               
                  </div>

                    <div class="modal-body d-flex justify-content-center">
                        <button type="button" class="btn btn-secondary" id="more">+</button>
                   </div>
                   <div id="more-modal-body">               
                  </div>
                  
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>`;
                document.getElementById('more-modal-body').style.display = `none`;
                this.getCharacterComics(comics)
                document.getElementById('more').onclick = () => this.showMoreComic();

            };
        };

    };

    showComic(results) {
        document.getElementById("modal-body").innerHTML +=
            `<div class="imgComics">
            <h6>${results.title}</h6>
            <img src="${results.thumbnail.path}.${results.thumbnail.extension}" alt="Marvel">
            </div>`

    }
    moreComic(results) {
        document.getElementById('more-modal-body').innerHTML +=
            `<div class="imgComics">
            <h6>${results.title}</h6>
            <img src="${results.thumbnail.path}.${results.thumbnail.extension}" alt="Marvel">
            </div>`
    }
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

        for (const link of this.links) {
            link.onclick = event => {
                const pageN = event.target.dataset.page;
                const offset = ((parseInt(pageN) - 1) * this.limit);
                this.newPage(offset);
            };
        };
    };
    results() {
        for (const btnResult of this.btnResults) {
            btnResult.onclick = () => {
                const number = parseInt(btnResult.innerHTML);
                if (this.limit != number) {
                    this.limit = number;
                    this.initApp();
                };
            };
        };
        for (const btnResult of this.btnResults) {
            if (this.limit === parseInt(btnResult.innerHTML)) {
                btnResult.style.color = `grey`;
                btnResult.style.cursor = `not-allowed`;
            } else {
                btnResult.style.color = `blue`;
                btnResult.style.cursor = `pointer`;
            };
        };
    };
};
new App();
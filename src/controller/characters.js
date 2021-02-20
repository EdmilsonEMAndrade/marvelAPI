import urlMarvel from '../services/urlMarvel'

//https://gateway.marvel.com/v1/public/characters?apikey=07f05d67192c439bf8203269fc153fdd&hash=a2110823d4049282bfbe666bd8e79fff&ts=1609890812920&limit=20
const apikey = "07f05d67192c439bf8203269fc153fdd";
const hash = 'a2110823d4049282bfbe666bd8e79fff';
const ts = '1609890812920';
const key = '?apikey=07f05d67192c439bf8203269fc153fdd&hash=a2110823d4049282bfbe666bd8e79fff&ts=1609890812920';
let limit = 50;


class Characters {
    constructor() {
        this.btnPage = document.querySelector('.pagination');
        this.tableBody = document.querySelector(".table tbody");
        this.links = document.getElementsByClassName("page-link");
        this.imgHeros = document.getElementsByClassName("imgHero");
        this.init()
    }

    async init(offset = 0) {
        console.log(urlMarvel.get(`/stories/19947${key}`))
        try {
            const characters = await urlMarvel.get(`/characters${key}&limit=${limit}&offset=${offset}`)
            this.getCharacters(characters.data.data.results)
            this.page(characters.data.data.total)
        } catch (error) {
            console.log(error)
        }
    }

    getCharacters(data) {
        this.tableBody.innerHTML = ``;
        let contador = 0;
        data.forEach(element => {
            let img;
            if (element.thumbnail.path != "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available") {
                img = `<img class="imgHero" data-position="${contador}" width="100px" height="100px" src="${element.thumbnail.path}.${element.thumbnail.extension}" title="${element.name}" alt=""></td>`
                console.log("if")
            } else {
                img = `<img class="imgHero" data-position="${contador}"width="100px" src="/img/marvel.png" title="${element.name}" alt=""></td>`
                console.log("else")
            }

            const tr = `
                        <tr>
                            <td>${element.id}</td>
                            <td>${element.name}</td>
                            <td><a href="#" data-bs-toggle="modal" data-bs-target="#marvelHero">

                            ${img}
                            </a>
                        </tr>`;
            this.tableBody.innerHTML += tr;
            contador++;

        });
        console.log(data)
        for (const hero of this.imgHeros) {
            hero.onclick = event => {
                const index = event.target.dataset.position;
                document.getElementById('marvelHero').innerHTML =
                    `<div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${data[index].name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                  </div>
                </div>
              </div>`
            }

        }

    }

    page(total) {
        const pages = Math.ceil(total / limit);
        this.btnPage.innerHTML = ``;
        for (let index = 1; index < pages; index++) {

            const li = ` <li class="page-item"><a class="page-link" href="#" data-page="${index}">${index}</a></li>`;
            this.btnPage.innerHTML += li;

        }

        for (const link of this.links) {

            link.onclick = event => {
                console.log(event)
                const page = event.target.dataset.page;
                this.init((parseInt(page) - 1) * limit)
            }
        }


    }
}

export default new Characters();

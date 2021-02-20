import Characters from './controller/characters'

class App {
    constructor() {
        this.btnPage = document.querySelector('.pagination');
        this.links = document.getElementsByClassName("page-link");
        this.divImgs = document.getElementById("imgs");
        this.imgHeros = document.getElementsByClassName("imgHero");
        this.modal = document.getElementById('marvelCharacterModal');

        this.limit = 50;
        this.initApp();

    }
    async initApp() {
        const personagem = await Characters.getResults(0, this.limit)
        this.showCharacters(personagem.results)
        this.page(personagem.total)

    }
    async newPage(offset = 0) {
        const personagem = await Characters.getResults(offset, this.limit)
        this.showCharacters(personagem.results)
    }
    showCharacters(data) {
        this.divImgs.innerHTML = ``;
        let contador = 0;
        data.forEach(element => {
            let img;
            if (element.thumbnail.path != "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available") {

                img = `<a href="#" data-bs-toggle="modal" data-bs-target="#marvelCharacterModal"><img class="imgHero" data-position="${contador}" width="10vw" height="100px" src="${element.thumbnail.path}.${element.thumbnail.extension}" title="${element.name}" alt="${element.name}"/></a>`

            } else {

                img = `<a href="#" data-bs-toggle="modal" data-bs-target="#marvelCharacterModal"><img class="imgHero" data-position="${contador}"width="10vw" height="100px" src="/img/marvel.png" title="${element.name}" alt="${element.name}"/></a>`

            }
            this.divImgs.innerHTML += `${img} `;
            contador++;

        });
        for (const hero of this.imgHeros) {
            hero.onclick = event => {
                let index = event.target.dataset.position;
                this.modal.innerHTML = `
<div class="modal-dialog">
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
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      
    </div>
  </div>
</div>`

            }



        }
    }

    page(total) {
        console.log(total)
        const pages = Math.ceil(total / this.limit);
        //this.btnPage.innerHTML = ``;
        for (let index = 1; index < pages; index++) {

            const li = ` <li class="page-item"><a class="page-link" href="#" data-page="${index}">${index}</a></li>`;
            this.btnPage.innerHTML += li;

        }

        for (const link of this.links) {

            link.onclick = event => {
                console.log(event)
                const pageN = event.target.dataset.page;
                const offset = ((parseInt(pageN) - 1) * this.limit)
                this.newPage(offset)
            }
        }


    }
}

new App();



import urlMarvel from '../services/urlMarvel'
const key = '?apikey=07f05d67192c439bf8203269fc153fdd&hash=a2110823d4049282bfbe666bd8e79fff&ts=1609890812920';
class Comic {
    constructor() {

    };

    async getComic(idComic) {
        idComic = this.getComicID(idComic)

        try {
            const result = await urlMarvel.get(`/comics/${idComic}${key}`)

            return result.data.data
        } catch (error) {
            console.log(error);
        };
    };

    getComicID(idComic) {
        let id = '';
        for (let index = idComic.length - 1; index > 0; index--) {
            if (idComic[index] === '/') {
                break;
            };
            id += idComic[index];
        };
        return id.split('').reverse().join('');
    };
};

export default new Comic();
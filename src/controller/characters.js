import urlMarvel from '../services/urlMarvel'

//https://gateway.marvel.com/v1/public/characters?apikey=07f05d67192c439bf8203269fc153fdd&hash=a2110823d4049282bfbe666bd8e79fff&ts=1609890812920&limit=20
const apikey = "07f05d67192c439bf8203269fc153fdd";
const hash = 'a2110823d4049282bfbe666bd8e79fff';
const ts = '1609890812920';
const key = '?apikey=07f05d67192c439bf8203269fc153fdd&hash=a2110823d4049282bfbe666bd8e79fff&ts=1609890812920';



class Characters {
    constructor() {

    }

    async getResults(offset = 0, limit = 50) {

        try {
            const characters = await urlMarvel.get(`/characters${key}&limit=${limit}&offset=${offset}`);
            return characters.data.data;
        } catch (error) {
            console.log(error);
        }


    }




}

export default new Characters();

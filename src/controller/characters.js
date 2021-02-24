import urlMarvel from '../services/urlMarvel';
const key = '?apikey=07f05d67192c439bf8203269fc153fdd&hash=a2110823d4049282bfbe666bd8e79fff&ts=1609890812920';

class Characters {
    constructor() {

    };

    async getResults(offset = 0, limit = 50) {

        try {
            const characters = await urlMarvel.get(`/characters${key}&limit=${limit}&offset=${offset}`);
            return characters.data.data;
        } catch (error) {
            console.log(error);
        };
    };
    async getSearch(characterName) {
        try {
            const characters = await urlMarvel.get(`/characters${key}&nameStartsWith=${characterName}`);
            return characters.data.data;
        } catch (error) {
            console.log(error);
        };
    }
};

export default new Characters();

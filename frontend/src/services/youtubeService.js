import axios from 'axios';
import he from 'he';

const BASE_URL = 'https://www.googleapis.com/youtube/v3/search'
const API_KEYS = ['AIzaSyCPP5cxksnuliRKXkqCqeZYG3dviWGM5cM', 'AIzaSyDzlrVY5xgIReWcL92FgEkdN4Z7kym6CBg'];
var gCurrApiKey = 1;
var gCount = 0

export const youtubeService = {
    get,
    titleSimplify
}

async function get(query) {
    try {
        const res = await axios.get(`${BASE_URL}?videoCategoryId=10&part=id,snippet&videoEmbeddable=true&type=video&maxResults=10&q=${query}&key=${API_KEYS[gCurrApiKey]}`)
        return res.data;
    } catch (err) {
        console.dir(err);
        if (gCount === API_KEYS.length) {
            gCount = 0
            throw (err)
        } else {
            gCurrApiKey++;
            gCount++;
            if (gCurrApiKey >= API_KEYS.length) gCurrApiKey = 0;
            return get(query);
        }
    }
}


function titleSimplify(title) {
    // Removes HTML char codes
    let output = he.decode(title);
    // Removes 'Official Video' brackets
    const officialVideoRegex = /[([].?(official.?video)?(official music video)?.?[)\]]/ig
    output = output.replace(officialVideoRegex, '');

    return output;
}
import axios from 'axios';
import he from 'he';

const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'
const DETAILS_URL = 'https://www.googleapis.com/youtube/v3/videos'
const API_KEYS = ['AIzaSyCPP5cxksnuliRKXkqCqeZYG3dviWGM5cM', 'AIzaSyDzlrVY5xgIReWcL92FgEkdN4Z7kym6CBg', 'AIzaSyAI58t1goVjCdrSsvtkgBAz0D9_2xhhTXI'];
var gCurrApiKey = 0;
var gCount = 0

export const youtubeService = {
    get,
    titleSimplify,
    getDuration
}

async function get(query) {
    try {
        const res = await axios.get(`${SEARCH_URL}?videoCategoryId=10&part=id,snippet&videoEmbeddable=true&type=video&maxResults=10&q=${query}&key=${API_KEYS[gCurrApiKey]}`);
        gCount = 0;
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

async function getDuration(youtubeId) {
    try {
        let res = await axios.get(`${DETAILS_URL}?id=${youtubeId}&part=contentDetails&key=${API_KEYS[gCurrApiKey]}`);
        let duration = res.data.items[0].contentDetails.duration;
        duration = duration.substring(2);
        duration = duration.replace('M', ':');
        duration = duration.split(':')
        duration[1] = duration[1].replace('S', '');
        duration[1] = duration[1].padStart(2, '0');
        duration = duration.join(':');
        return duration.toString();
    } catch (err) {
        console.log(err);
        throw err;
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
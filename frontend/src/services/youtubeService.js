import axios from 'axios';
import he from 'he';

const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'
const DETAILS_URL = 'https://www.googleapis.com/youtube/v3/videos'
const API_KEYS = ['AIzaSyAbaXz2dtxN2j9YDNLWye8RfS4OOWLeNXM', 'AIzaSyAet-69tcMxIVjZynUUldjLss45_pnl60U', 'AIzaSyAlHfUbV7L6R0Y8GNZMAK6seo2tOtDWsVw'];
var gCurrApiKey = 2;
var gCount = 0

export const youtubeService = {
    get,
    titleSimplify,
    getDuration,
    getSongById,
}

async function get(query) {
    try {
        console.log("get -> API_KEYS[gCurrApiKey]", API_KEYS[gCurrApiKey])
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

async function getSongById(youtubeId) {
    try {
        const res = await axios.get(`${DETAILS_URL}?id=${youtubeId}&part=id,contentDetails,snippet&key=${API_KEYS[gCurrApiKey]}`);
        return res.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getDuration(youtubeId, timeString) {
    let duration
    if (!timeString) {
        try {
            let res = await axios.get(`${DETAILS_URL}?id=${youtubeId}&part=contentDetails&key=${API_KEYS[gCurrApiKey]}`);
            duration = res.data.items[0].contentDetails.duration;
        } catch (err) {
            console.log(err);
            throw err;
        }
    } else duration = timeString;
    try {
        duration = duration.substring(2);
        duration = duration.replace('M', ':');
        duration = duration.split(':')
        duration[1] = duration[1].replace('S', '');
        duration[1] = duration[1].padStart(2, '0');
        duration = duration.join(':');
        return duration.toString();
    } catch (err) {
        return null;
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
import axios from 'axios';
import he from 'he';

const BASE_URL = 'https://www.googleapis.com/youtube/v3/search'
const API_KEY = 'AIzaSyCPP5cxksnuliRKXkqCqeZYG3dviWGM5cM';

export const youtubeService = {
    get,
    titleSimplify
}

async function get(query) {
    try {
        const res = await axios.get(`${BASE_URL}?videoCategoryId=10&part=id,snippet&videoEmbeddable=true&type=video&maxResults=10&q=${query}&key=${API_KEY}`)
        console.log("get -> res", res)
        return res.data;
    } catch (err) {
        console.dir(err);
    }
}

function titleSimplify(title) {
    // Removes HTML char codes
    let output = he.decode(title);
    // Removes 'Official Video' brackets
    const officialVideoRegex = /[([].?official.?video.?[)\]]/ig
    output = output.replace(officialVideoRegex, '');
    
    return output;
}
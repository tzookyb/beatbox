import axios from 'axios';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search'
const API_KEY = 'AIzaSyDd9KipmgPk6pAvx9HUICBglcd27bt-KlU';

export const youtubeService = {
    get
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
import React, { Component } from 'react'
import { youtubeService } from '../../services/youtubeService';
import { debounce } from 'debounce';




export class SongPick extends Component {
    state = {
        searchStr: '',
        results: '',
        isSearching: false
    }

    handleInput = (ev) => {
        const { value } = ev.target;
        if (!value) {
            this.setState({ searchStr: '', isSearching: false, results: '' });
            return;
        }
        this.setState({ searchStr: value, isSearching: true });
        if (!this.debouncedSearch) {
            this.debouncedSearch = debounce(() => this.getSongs(), 1000)
        }
        this.debouncedSearch();
    }

    getSongs = async () => {
        const query = this.state.searchStr;
        const res = await youtubeService.get(query);
        const results = res.items;
        this.setState({ results });
    }

    onAddSong = (result) => {
        this.props.onAddSong(result);
    }

    render() {
        const { results, isSearching, searchStr } = this.state;

        return (
            <div className={`song-pick ${this.props.isSearchOpen ? 'opened':''}`}>
                <input type="search" name="searchStr" value={searchStr} onChange={this.handleInput} placeholder="Add song to playlist" autoComplete="off" />

                {(isSearching && !results) && <div>Getting results...</div>}

                {results && results.map(result => {
                    const id = result.id.videoId;
                    const { title } = result.snippet;
                    const imgUrl = result.snippet.thumbnails.default.url;
                    return <div key={id} className="song-pick-result" onClick={() => this.onAddSong(result)}>
                        <img src={imgUrl} alt="thumbnail" />{title}
                    </div>
                })
                }
            </div>
        )
    }
}
import React, { Component } from 'react'
import { debounce } from 'debounce';
import { CircleLoading } from 'react-loadingg';

import { youtubeService } from '../../services/youtubeService';

export class SongPick extends Component {
    state = {
        searchStr: '',
        results: '',
        isSearching: false
    }

    inputRef = React.createRef()

    componentDidUpdate(prevProps, prevState) {
        // this.inputRef.current.focus();
    }


    handleInput = (ev) => {
        const { value } = ev.target;
        if (!value) {
            this.setState({ searchStr: '', isSearching: false, results: '' });
            return;
        }
        this.setState({ results: '', searchStr: value, isSearching: true });
        if (!this.debouncedSearch) {
            this.debouncedSearch = debounce(() => this.getSongs(), 1000)
        }
        this.debouncedSearch();
    }

    getSongs = async () => {
        const query = this.state.searchStr;
        const res = await youtubeService.get(query);
        if (!res) return
        const results = res.items;
        this.setState({ results });
    }

    onAddSong = (result) => {
        this.props.onAddSong(result);
    }

    render() {
        const { results, isSearching, searchStr } = this.state;
        return (
            <div className={`song-pick ${this.props.isSongPickOpen ? 'opened' : ''}`}>
                <input ref={this.inputRef} type="search" name="searchStr" value={searchStr} onChange={this.handleInput} placeholder="Add song to playlist" autoComplete="off" />

                {(isSearching && !results) && <div className="song-pick-msg flex justify-center">
                    Getting results...
                    <CircleLoading color="#ac0aff" />
                </div>}
                {results && !results.length && <div className="song-pick-msg flex justify-center">No results found</div>}
                {results && results.map(result => {
                    const id = result.id.videoId;
                    const title = youtubeService.titleSimplify(result.snippet.title);
                    const imgUrl = result.snippet.thumbnails.medium.url;

                    return <div key={id} className="song-pick-result" onClick={() => this.onAddSong(result)}>
                        <img src={imgUrl} alt="thumbnail" />
                        <span dir="auto">{title}</span>
                    </div>
                })
                }
            </div>
        )
    }
}
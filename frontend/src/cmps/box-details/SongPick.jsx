// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { debounce } from 'debounce';
import { CircleLoading } from 'react-loadingg';
// LOCAL IMPORTS
import { youtubeService } from '../../services/youtubeService';
import { Draggable } from 'react-beautiful-dnd';

export class SongPick extends Component {
    state = {
        searchStr: '',
        results: '',
        isSearching: false
    }

    inputRef = React.createRef();

    componentDidUpdate(prevProps) {
        if (prevProps.isSongPickOpen !== this.props.isSongPickOpen) this.nullResults();
        if (!prevProps.isSongPickOpen && this.props.isSongPickOpen) this.inputRef.current.focus();
    }

    nullResults = () => {
        this.setState({ searchStr: '', results: '', isSearching: false })
    }

    handleInput = (ev) => {
        const { value } = ev.target;
        if (!value) {
            this.nullResults();
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
        if (!res) return;
        const results = res.items;
        this.setState({ results });
    }

    onAddSong = (result) => {
        this.props.onAddSong(result);
    }

    render() {
        const { results, isSearching, searchStr } = this.state;
        const { isFilter } = this.props;
        return (
            <div className={`song-pick ${this.props.isSongPickOpen ? 'opened' : ''}`}>
                <input ref={this.inputRef} type="search" name="searchStr" value={searchStr} onChange={this.handleInput} placeholder="Search for music" autoComplete="off" />

                <div className={`song-pick-msg flex justify-center ${results.length ? 'hidden' : ''}`} >
                    {(isSearching && !results) &&
                        <React.Fragment>
                            Getting results...
                        <CircleLoading color="#ac0aff" />
                        </React.Fragment>
                    }
                    {results && !results.length && 'No results found.'}
                </div>

                {
                    results && results.map((result, idx) => {
                        const id = result.id.videoId;
                        const title = youtubeService.titleSimplify(result.snippet.title);
                        const imgUrl = result.snippet.thumbnails.medium.url;
                        return <Draggable key={id} draggableId={id} index={idx} isDragDisabled={isFilter}>
                            {provided => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="song-pick-result flex"
                                    onClick={() => this.onAddSong(result)}
                                >
                                    <img src={imgUrl} alt="thumbnail" />
                                    <h3 dir="auto">{title}</h3>
                                </div>
                            )}
                        </Draggable>
                    })
                }
            </div >
        )
    }
}
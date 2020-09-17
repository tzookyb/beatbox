import React, { Component } from 'react'
import { connect } from 'react-redux'

import { boxService } from '../services/boxService'
import { saveBox } from '../store/actions/boxAction'
import { cloudService } from '../services/cloudService'
import { SongPick } from '../cmps/box-details/SongPick'
import { SongPreview } from '../cmps/box-details/SongPreview'

export class _BoxAdd extends Component {
    state = {
        box: {
            name: '',
            tags: ['Hip-hop'],
            description: '',
            imgUrl: null,
            songs: []
        }
    }

    onAddBox = async (ev) => {
        ev.preventDefault();
        const newBox = await this.props.saveBox(this.state.box);
        // console.log("onAddBox -> newBox", newBox._id)
        this.props.history.push(`/box/${newBox._id}`);
    }

    handleInput = ({ target }) => {
        const field = target.name;
        const value = (target.name === 'tags') ? [target.value] : target.value;
        this.setState(prevState => {
            return {
                box: {
                    ...prevState.box,
                    [field]: value
                }
            }
        })
    }

    getGenresOptions() {
        const genres = boxService.getGenres();
        return genres.map((gener, idx) => {
            return <option key={idx} value={gener}>{gener}</option>
        })
    }

    async uploadImg(ev) {
        const imgUrl = await cloudService.uploadImg(ev)
        this.setState(prevState => {
            return {
                box: {
                    ...prevState.box,
                    imgUrl
                }
            }
        })
    }

    onAddSong = (song) => {
        const newSong = boxService.addSong(song);
        const songs = [...this.state.box.songs, newSong];
        this.setState(prevState => {
            return {
                box: {
                    ...prevState.box,
                    songs
                }
            }
        })
    }
    //Add Song pick
    render() {
        const { box } = this.state;
        return (
            <section className="box-add main-container">
                <h2>Create Your Box</h2>
                <form onSubmit={this.onAddBox} className="box-add-form flex column align-center" >
                    <input type="txt" value={box.name} placeholder='Enter box name:' onChange={this.handleInput} name="name" />
                    <input type="txt" value={box.description} placeholder='About the box: ' onChange={this.handleInput} name="description" />

                    <label htmlFor="tags">Genre:</label>
                    <select id="tags" name="tags" onChange={this.handleInput} >
                        {this.getGenresOptions()}
                    </select>
                    <div className="upload-img-container flex">
                        <label className="upload-label" style={{ cursor: 'pointer' }}> Upload Photo!
                        <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                        </label>
                        {this.state.box.imgUrl && <img src={this.state.box.imgUrl} alt="box-img" />}
                    </div>
                    <div className="song-list flex space-between">
                        <ul className="clean-list flex column space-between flex-1">
                            {this.state.box.songs.map(song => <SongPreview song={song} />)}

                        </ul>
                        <SongPick onAddSong={this.onAddSong} />
                    </div>

                    <button>Save</button>
                </form>
            </section >
        )
    }
}

const mapStateToProps = state => {
    return {
        // boxes: state.boxReducer.boxes,
    }
}
const mapDispatchToProps = {
    saveBox
}

export const BoxAdd = connect(mapStateToProps, mapDispatchToProps)(_BoxAdd)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { boxService } from '../services/boxService'
import { saveBox } from '../store/actions/boxAction'
import { cloudService } from '../services/cloudService'

export class _BoxAdd extends Component {
    state = {
        box: {
            name: '',
            tags: [],
            description: '',
            imgUrl: null,
            songs: []
        }
    }

    onAddBox = (ev) => {
        ev.preventDefault();
        this.props.saveBox(this.state.box)

        // this.props.history.push(`/box/${boxId}`);

    }

    handleInput = ({ target }) => {
        const field = target.name;
        const value = (target.name === 'tags') ?  [target.value]: target.value;
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


    //Add Song pick
    render() {
        const { box } = this.state;
        return (
            <section>
                <h2>Create Your Box</h2>
                <form onSubmit={this.onAddBox} >
                    <input type="txt" value={box.name} placeholder='Enter box name:' onChange={this.handleInput} name="name" />
                    <input type="txt" value={box.description} placeholder='About the box: ' onChange={this.handleInput} name="description" />
                    <select id="tags" name="tags" onChange={this.handleInput}>
                        {this.getGenresOptions()}
                    </select>
                    <label> Upload Img
                       <input onChange={(ev) => this.uploadImg(ev)} type="file" />
                    </label>
                    {this.state.box.imgUrl && <img src={this.state.box.imgUrl}/>}
                    <button>Save</button>
                </form>
            </section>
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

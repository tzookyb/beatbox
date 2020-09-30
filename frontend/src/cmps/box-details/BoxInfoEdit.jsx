// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import CircleLoading from 'react-loadingg/lib/CircleLoading';

// LOCAL IMPORTS
import { cloudService } from '../../services/cloudService'
import { boxService } from '../../services/boxService'
import imgPlaceholder from '../../assets/img/img_placeholder.png';

export class BoxInfoEdit extends Component {
    state = {
        box: {
            name: '',
            genre: '',
            description: '',
            imgUrl: null
        },
    }

    onSaveInfo = (ev) => {
        ev.preventDefault();
        this.props.onSaveInfo(this.state.box);
    }

    handleInput = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => {
            return {
                box: {
                    ...prevState.box,
                    [field]: value
                }
            }
        }, () => this.props.updateBox(this.state.box))

    }

    getGenresOptions() {
        const genres = boxService.getAllGenres();
        return genres.map((genre, idx) => {
            return <option key={idx} value={genre}>{genre}</option>
        })
    }

    async uploadImg(ev) {
        this.props.setIsLoading(true);
        const imgUrl = await cloudService.uploadImg(ev);
        this.props.setIsLoading(false);

        this.setState(prevState => {
            return {
                box: {
                    ...prevState.box,
                    imgUrl
                }
            }
        }, () => this.props.updateBox(this.state.box))
    }

    render() {
        const { box } = this.state;
        if (!box) return <CircleLoading size="large" color="#ac0aff" />
        return (
            <form>
                <div className="box-add-form flex column">

                    <div className="box-add-thumbnail flex">
                        <label className="upload-label" style={{ cursor: 'pointer' }} >
                            <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                            <img src={box.imgUrl || imgPlaceholder} alt="box" />
                            <div>
                                {box.imgUrl ? '' : 'Upload Image'}
                            </div>
                        </label>
                    </div>

                    <div className="inputs flex column align-center">

                        <label>Name:</label>
                        <input
                            className="short-input"
                            autoComplete="off"
                            autoFocus
                            type="txt"
                            value={box.name}
                            name="name"
                            onChange={this.handleInput}
                            placeholder="Box Name"
                        />

                        <label>Genre:</label>
                        <select
                            className="short-input"
                            id="genre"
                            name="genre"
                            onChange={this.handleInput}
                        >
                            <option disabled selected value="">Select genre</option>
                            {this.getGenresOptions()}
                        </select>

                        <label>Description:</label>
                        <textarea
                            type="txt"
                            value={box.description}
                            name="description"
                            onChange={this.handleInput}
                            placeholder="About the box"
                        />

                    </div>

                </div>

            </form >
        )
    }
}


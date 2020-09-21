import React, { Component } from 'react'
// import SaveIcon from '@material-ui/icons/Save';
// import CreateIcon from '@material-ui/icons/Create';
import { cloudService } from '../../services/cloudService'
import { boxService } from '../../services/boxService'
import imgPlaceholder from '../../assets/img/img_placeholder.png';
import CircleLoading from 'react-loadingg/lib/CircleLoading';

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
        this.props.onSaveInfo(this.state.box)
    }

    handleInput = ({ target }) => {
        const field = target.name;
        // const value = (target.name === 'tags') ? [target.value] : target.value;
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
        const genres = boxService.getGenres();
        return genres.map((gener, idx) => {
            return <option key={idx} value={gener}>{gener}</option>
        })
    }

    async uploadImg(ev) {
        this.props.setIsLoading('true');
        const imgUrl = await cloudService.uploadImg(ev);
        this.props.setIsLoading('');

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
        if (!box) return <CircleLoading  size="large" color= "#ac0aff"/>
        return (
            <form className="box-info flex space-between">
                <div className="info-input-actions flex space-between column">
                    <input autoComplete="off" autoFocus type="txt" value={box.name} name="name" onChange={this.handleInput} placeholder="Box Name" />
                    <textarea type="txt" value={box.description} name="description" onChange={this.handleInput} placeholder="About the box" />
                    <label>Genre: </label>
                    <select id="genre" name="genre" onChange={this.handleInput} >
                    <option value=""></option>
                        {this.getGenresOptions()}
                    </select>
                </div>
                <div className="box-img">
                    <label className="upload-label" style={{ cursor: 'pointer' }} >
                        <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                        <div className="upload-box-img">
                            {box.imgUrl ? '' : 'Upload Image'}
                        </div>
                        <img src={box.imgUrl || imgPlaceholder} alt="box" />
                    </label>
                </div>
            </form>
        )
    }
}


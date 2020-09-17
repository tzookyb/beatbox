import React, { Component } from 'react'
import SaveIcon from '@material-ui/icons/Save';
import CreateIcon from '@material-ui/icons/Create';
import { cloudService } from '../../services/cloudService'

export class BoxInfo extends Component {
    state = {
        box: null,
        isEditableName: false,
        isEditableDesc: false,
        isEditableImg: false
    }

    componentDidMount() {
        const { box } = this.props;
        this.setState({ box })
    }

    onEdit = (field) => {
        this.setState({ [field]: true })
    }

    onSave = (field) => {
        this.setState({ [field]: false });
        this.props.onSaveInfo(this.state.box);
    }

    handleInput = ({ target }) => {
        const field = target.name
        const value = target.value
        this.setState(prevState => {
            return {
                box: {
                    ...prevState.box,
                    [field]: value
                }
            }
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
        this.onSave('isEditableImg');
    }

    render() {
        const { box } = this.state;
        const { isEditableName, isEditableDesc } = this.state;
        if (!box) return <h1>Loading..</h1>
        return (
            <section className="box-info flex space-between">
                <div className="info-txt flex space-between column">
                    <div className="info-header flex align-end">
                        {!isEditableName && <h2 className="box-name"> {box.name}</h2>}
                        {!isEditableName && <button onClick={() => this.onEdit('isEditableName')} className="hide-btn"><CreateIcon /></button>}
                        {isEditableName && <input autoFocus type="txt" value={box.name} name="name" onChange={this.handleInput} />}
                        {isEditableName && <button onClick={() => this.onSave('isEditableName')} ><SaveIcon /></button>}
                    </div>

                    <div className="info-description flex">
                        {!isEditableDesc && <p className="box-description"> {box.description}</p>}
                        {!isEditableDesc && <button onClick={() => this.onEdit('isEditableDesc')} className="hide-btn"><CreateIcon /></button>}
                        {isEditableDesc && <textarea autoFocus type="txt" value={box.description} name="description" onChange={this.handleInput} />}
                        {isEditableDesc && <button onClick={() => this.onSave('isEditableDesc')} ><SaveIcon /></button>}
                    </div>

                    <div className="info-creator">
                        Dani
                </div>
                </div>
                <div className="social-params">
                    <p>likes</p>
                    <p>listeners</p>
                </div>


                <div className="box-img">
                    <label className="upload-label" style={{ cursor: 'pointer' }}>
                        <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                        <img src={box.imgUrl} alt="" />
                    </label>
                </div>

            </section>
        )
    }
}


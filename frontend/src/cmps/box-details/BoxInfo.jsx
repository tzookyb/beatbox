import React, { Component } from 'react'

import SaveIcon from '@material-ui/icons/Save';
import CreateIcon from '@material-ui/icons/Create';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import Avatar from '@material-ui/core/Avatar';
import CircleLoading from 'react-loadingg/lib/CircleLoading';

import { cloudService } from '../../services/cloudService';
// import { boxService } from '../../services/boxService';


export class BoxInfo extends Component {
    state = {
        box: null,
        isEditableName: false,
        isEditableDesc: false,
        isEditableImg: false
    }

    componentDidMount() {
        const { box } = this.props;
        this.setState({ box });
    }

    componentDidUpdate(prevProps, prevState) {
        const newBox = this.props.box;
        if (prevProps.box === newBox) return;
        this.setState({ box: newBox });
    }

    onEdit = (field) => {
        this.setState({ [field]: true })
    }

    onSave = (field) => {
        this.setState({ [field]: false });
        const newBox = { ...this.state.box }
        this.props.onSaveInfo(newBox);
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
        const { box, isEditableName, isEditableDesc } = this.state;
        // const { minimalUser } = this.props;
        if (!box) return <CircleLoading size="large" color="#ac0aff" />
        return (
            <section className="box-info flex">
                <div className="box-img">
                    <label className="upload-label" style={{ cursor: 'pointer' }}>
                        <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                        <img
                            crossOrigin={"anonymous"}
                            ref={this.props.imgRef}
                            src={box.imgUrl}
                            alt=""
                            onLoad={this.props.getDominantColor} />
                    </label>
                </div>
                <div className="info-txt flex space-between column">
                    <div className="info-header flex align-end flex-1">
                        {isEditableName ?
                            <React.Fragment>
                                <input autoFocus type="txt" value={box.name} name="name" onChange={this.handleInput} />
                                <div className="btn-hide-container">
                                    <button onClick={() => this.onSave('isEditableName')} ><SaveIcon /></button>
                                </div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <h2 className="box-name"> {box.name}</h2>
                                <button onClick={() => this.onEdit('isEditableName')} className="hide-btn"><CreateIcon /></button>

                            </React.Fragment>
                        }
                    </div>

                    <div className="info-description flex">
                        {!isEditableDesc && <p className="box-description"> {box.description}</p>}
                        <div className="btn-hide-container">
                            {!isEditableDesc && <button onClick={() => this.onEdit('isEditableDesc')} className="hide-btn"><CreateIcon /></button>}
                        </div>
                        {isEditableDesc && <textarea autoFocus type="txt" value={box.description} name="description" onChange={this.handleInput} />}
                        {isEditableDesc && <button onClick={() => this.onSave('isEditableDesc')} ><SaveIcon /></button>}
                    </div>
                    <h4>{box.genre}</h4>

                    <div className="info-creator flex align-center">
                        <h5>Created By: </h5>
                        <Avatar alt="Remy Sharp" src={box.createdBy.imgUrl} style={{ width: '35px', height: '35px' }} />
                        <h5>{box.createdBy.name}</h5>
                    </div>
                </div>
            </section >
        )
    }
}
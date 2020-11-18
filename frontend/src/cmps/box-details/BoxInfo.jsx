// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import SaveIcon from '@material-ui/icons/Save';
import CreateIcon from '@material-ui/icons/Create';
import Avatar from '@material-ui/core/Avatar';
import CircleLoading from 'react-loadingg/lib/CircleLoading';

// LOCAL IMPORTS
import { cloudService } from '../../services/cloudService';

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

    componentDidUpdate(prevProps) {
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
        if (!box) return <CircleLoading size="large" color="#ac0aff" />
        return (
            <section className="box-info flex">

                <div className="box-img">
                    <label className="cursor-pointer">
                        <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                        <img
                            crossOrigin={"anonymous"}
                            ref={this.props.imgRef}
                            src={box.imgUrl}
                            alt="box"
                            title="Click to change Box Image"
                            onLoad={this.props.getDominantColor} />
                    </label>
                </div>

                <div className="info-txt flex space-between column">
                    <div className="info-header flex align-center">
                        {isEditableName ?
                            <div className="flex align-center posrel">
                                <input autoFocus type="txt" value={box.name} name="name" onChange={this.handleInput} />
                                <SaveIcon className="cursor-pointer" onClick={() => this.onSave('isEditableName')} />
                            </div>
                            :
                            <div className="flex align-center posrel">
                                <h2 className="box-name" title={box.name}> {box.name}</h2>
                                <CreateIcon className="edit-btn cursor-pointer" onClick={() => this.onEdit('isEditableName')} />
                            </div>
                        }
                    </div>

                    <div className="info-description flex">
                        {isEditableDesc ?
                            <div className="flex align-center posrel">
                                <textarea autoFocus type="txt" value={box.description} name="description" onChange={this.handleInput} />
                                <SaveIcon className="cursor-pointer" onClick={() => this.onSave('isEditableDesc')} />
                            </div>
                            :
                            <div className="flex align-center posrel">
                                <p className="box-description" title={box.description}>{box.description}</p>
                                <CreateIcon className="edit-btn cursor-pointer" onClick={() => this.onEdit('isEditableDesc')} />
                            </div>
                        }
                    </div>

                    <div className="flex space-between align-center gap5">
                        <h4>{box.genre}</h4>

                        <div className="info-creator flex align-center gap3">
                            <h5>Created by:</h5>
                            <Avatar alt="Avatar" src={box.createdBy.imgUrl} style={{ width: '35px', height: '35px' }} />
                            <h5>{box.createdBy.name}</h5>
                        </div>
                    </div>

                </div>
            </section >
        )
    }
}
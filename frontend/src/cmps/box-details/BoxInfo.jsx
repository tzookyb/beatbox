import React, { Component } from 'react'

import SaveIcon from '@material-ui/icons/Save';
import CreateIcon from '@material-ui/icons/Create';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import CircleLoading from 'react-loadingg/lib/CircleLoading';

import { cloudService } from '../../services/cloudService';
import { boxService } from '../../services/boxService';

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

    getUsersAvatars(connectedUsers) {
        const avatars = connectedUsers.map(user => {
            return <Avatar alt={user.name} src={user.imgUrl} style={{ width: '30px', height: '30px' }} />
        })
        return avatars;
    }

    getIsUserLikeBox(box, minimalUser) {
        return (boxService.getIsUserLikeBox(box, minimalUser) !== -1) ? 'liked' : '';
    }

    render() {
        const { box, isEditableName, isEditableDesc } = this.state;
        const { minimalUser } = this.props;
        if (!box) return <CircleLoading size="large" color="#ac0aff" />
        return (
            <section className="box-info flex space-between">
                <div className="info-txt flex space-between column">
                    <div className="info-header flex align-end">
                        {isEditableName ?
                            <React.Fragment>
                                <input autoFocus type="txt" value={box.name} name="name" onChange={this.handleInput} />
                                <button onClick={() => this.onSave('isEditableName')} ><SaveIcon /></button>
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
                        {!isEditableDesc && <button onClick={() => this.onEdit('isEditableDesc')} className="hide-btn"><CreateIcon /></button>}
                        {isEditableDesc && <textarea autoFocus type="txt" value={box.description} name="description" onChange={this.handleInput} />}
                        {isEditableDesc && <button onClick={() => this.onSave('isEditableDesc')} ><SaveIcon /></button>}
                    </div>
                    <h4>Genre: {box.genre}</h4>

                    <div className="info-creator">
                        {box.createdBy.name}
                </div>
                </div>
                <div className="social-params">
                    <div onClick={() => this.props.onToggleLikeBox(box._id, minimalUser)} className={`like ${this.getIsUserLikeBox(box, minimalUser)}`}>
                        {box.likedByUsers.length}
                        <FavoriteIcon />
                    </div>
                    <AvatarGroup className="connected-users" max={4}>
                        {this.getUsersAvatars(box.connectedUsers)}
                    </AvatarGroup>
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


import React, { Component } from 'react'

import SaveIcon from '@material-ui/icons/Save';
import CreateIcon from '@material-ui/icons/Create';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Avatar from '@material-ui/core/Avatar';
import CircleLoading from 'react-loadingg/lib/CircleLoading';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';

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

                <div className="social-params flex column space-between">
                    <div onClick={() => this.props.onToggleLikeBox(box._id, minimalUser)} className={`like ${this.getIsUserLikeBox(box, minimalUser)}`}>
                        {box.likedByUsers.length}
                        <FavoriteIcon />
                    </div>

                    <div className="share-btns-container flex space-evenely">
                        <a className="facebook-share-btn" href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} rel="noopener noreferrer" target="_blank"><FacebookIcon /></a>
                        <a className="whatsapp-share-btn" href={`whatsapp://send?text=${window.location.href}`} data-action="share/whatsapp/share"><WhatsAppIcon /></a>
                    </div>
                </div>

                <div className="box-img">
                    <label className="upload-label" style={{ cursor: 'pointer' }}>
                        <input onChange={(ev) => this.uploadImg(ev)} type="file" hidden />
                        <img src={box.imgUrl} alt="" />
                    </label>
                </div>

            </section >
        )
    }
}


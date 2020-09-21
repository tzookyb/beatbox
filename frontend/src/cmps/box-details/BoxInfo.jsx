import React, { Component } from 'react'
import SaveIcon from '@material-ui/icons/Save';
import CreateIcon from '@material-ui/icons/Create';
// import ShareIcon from '@material-ui/icons/Share';

import { cloudService } from '../../services/cloudService'
import CircleLoading from 'react-loadingg/lib/CircleLoading';

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
        const newBox = this.props.box
        if (prevProps.box === newBox) return;
        this.setState({ box: newBox })
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

    onShare = async () => {
        console.log('share');
        // try {
        //     const result = await Share.share({
        //         message:
        //             'React Native | A framework for building native apps using React',
        //     });
        //     if (result.action === Share.sharedAction) {
        //         if (result.activityType) {
        //             // shared with activity type of result.activityType
        //         } else {
        //             // shared
        //         }
        //     } else if (result.action === Share.dismissedAction) {
        //         // dismissed
        //     }
        // } catch (error) {
        //     alert(error.message);
        // }
    }
    render() {
        const { box } = this.state;
        const { isEditableName, isEditableDesc } = this.state;
        if (!box) return <CircleLoading  size="large" color= "#ac0aff"/>
        return (
            <section className="box-info flex space-between">
                <div className="info-txt flex space-between column">
                    <div className="info-header flex align-end">

                        {/* Suggestion for readability, if good, then do same below */}
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

                        {/* {!isEditableName && <h2 className="box-name"> {box.name}</h2>}
                        {!isEditableName && <button onClick={() => this.onEdit('isEditableName')} className="hide-btn"><CreateIcon /></button>}
                        {isEditableName && <input autoFocus type="txt" value={box.name} name="name" onChange={this.handleInput} />}
                        {isEditableName && <button onClick={() => this.onSave('isEditableName')} ><SaveIcon /></button>} */}
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
                    {/* <ShareIcon onClick={this.onShare} /> */}
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


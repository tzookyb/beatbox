// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
import CloseIcon from '@material-ui/icons/Close';
// LOCAL IMPORTS
import { boxService } from '../services/boxService'
import { userService } from '../services/userService'
import { saveBox, loadBoxes } from '../store/actions/boxAction'
import { BoxInfoEdit } from '../cmps/box-details/BoxInfoEdit'
const defaultBoxImg = 'https://res.cloudinary.com/tzookyb/image/upload/v1602846820/beatbox/j8kqknrb7vkjhzh8muzj.jpg'

export class _BoxAdd extends Component {
    state = {
        editBox: null,
        msgWarning: '',
        isLoading: false
    }

    componentDidMount() {
        this.setNewBox();
    }

    setNewBox = () => {
        const minimalUser = userService.getMinimalUser();
        const emptyBox = boxService.getEmptyBox(minimalUser);
        this.setState({ editBox: emptyBox });
    }

    printMsg(msg) {
        this.setState({ msgWarning: msg });
        setTimeout(() => {
            this.setState({ msgWarning: '' });
        }, 2000)
    }

    setIsLoading = (isLoading) => {
        this.setState({ isLoading });
    }

    updateBox = (box) => {
        this.setState(prevState => ({
            editBox:
            {
                ...prevState.editBox,
                name: box.name,
                genre: box.genre,
                description: box.description,
                imgUrl: box.imgUrl
            }
        }));
    }

    onAddBox = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!this.state.editBox.name) {
            this.printMsg('Name of box is required');
            return;
        }
        if (!this.state.editBox.genre) {
            this.printMsg('Genre of box is required');
            return;
        }
        if (!this.state.editBox.imgUrl) {
            await this.setState({ editBox: {...this.state.editBox, imgUrl: defaultBoxImg}});
        }
        const addedBox = await this.props.saveBox(this.state.editBox);
        this.props.loadBoxes();
        this.props.history.push(`/box/details/${addedBox._id}`);
    }

    closeModal = () => {
        this.props.history.goBack();
        this.setNewBox();
    }

    render() {
        const { editBox } = this.state;
        const msg = this.state.msgWarning;
        if (!editBox) return <CircleLoading size="large" color="#ac0aff" />

        return (
            <section onClick={this.closeModal} className="box-add-container flex justify-center">

                <div className="box-add-modal flex column" onClick={ev => ev.stopPropagation()}>
                    <CloseIcon className="close-btn cursor-pointer" onClick={this.closeModal} />
                    <h2>Create your own Box</h2>


                    <BoxInfoEdit updateBox={this.updateBox} setIsLoading={this.setIsLoading} />

                    <button
                        disabled={this.state.isLoading}
                        className={`btn-create ${this.state.isLoading ? 'faded-btn' : ''}`}
                        onClick={this.onAddBox}
                    >
                        Create Box
                        </button>
                    <span className="msg-warning">{msg}</span>
                </div>
            </section>
        )
    }
}
const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = {
    saveBox,
    loadBoxes
}

export const BoxAdd = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoxAdd))
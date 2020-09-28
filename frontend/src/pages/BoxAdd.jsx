// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { connect } from 'react-redux'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
// LOCAL IMPORTS
import { boxService } from '../services/boxService'
import { userService } from '../services/userService'
import { saveBox, loadBoxes } from '../store/actions/boxAction'
import { BoxInfoEdit } from '../cmps/box-details/BoxInfoEdit'
import { withRouter } from 'react-router-dom'

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
        if (!editBox) return <CircleLoading size="large" color="#ac0aff" />
        return (
            <section onClick={this.closeModal} className="box-add-container flex justify-center">
                
                <div className="box-add-modal flex column" onClick={ev => ev.stopPropagation()}>

                    <h2>Create your own Box</h2>

                    <BoxInfoEdit updateBox={this.updateBox} setIsLoading={this.setIsLoading} />

                        <button
                            disabled={this.state.isLoading}
                            className={`btn-create ${this.state.isLoading ? 'faded-btn' : ''}`}
                            onClick={this.onAddBox}
                        >
                            Create Box
                        </button>
                        {this.state.msgWarning && <label className="msg-warnning">{this.state.msgWarning}</label>}
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
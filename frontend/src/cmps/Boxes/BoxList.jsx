import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { BoxPreview } from './BoxPreview'

export class BoxList extends Component {

    state = {
        isScrolled: false
    }

    ref = React.createRef()

    executeScroll = (scrollTo) => {
        let scrollDiff = this.ref.current.scrollWidth - this.ref.current.offsetWidth
        if (this.ref.current.scrollLeft === 0) {
            this.setState({ isScrolled: true });
        }
        else {
            this.setState({ isScrolled: false })
        }

        if (this.ref.current.scrollLeft >= scrollDiff) this.ref.current.scrollLeft = 0
        else this.ref.current.scrollLeft += scrollTo
    }

    render() {
        return (
            <section className={`list-container ${this.props.genre ? '' : 'main-container'}`}>

                {this.props.genre && <div className="genre-filter flex align-enter space-between">
                    <h3 className="title-genre">{this.props.genre}</h3>
                    <Link to={`/box?&genre=${this.props.genre}`}> <h3 className="see-all-genre">See All →</h3></Link>
                </div>}

                {this.props.genre &&
                    <div ref={this.ref} className="box-list image-container">
                        {this.state.isScrolled && <button className="list-left-btn" onClick={() => this.executeScroll(-350)}><ArrowBackIosIcon /></button>}

                        {this.props.boxes.map(box => {
                            if (box.genre === this.props.genre) {
                                return <BoxPreview
                                    isHomePage={true}
                                    key={box._id}
                                    box={box}
                                    genre={this.props.genre}
                                    // onToggleLikeBox={this.props.onToggleLikeBox}
                                    onAddToFavorites={this.props.onAddToFavorites}
                                    minimalUser={this.props.minimalUser}
                                    connectedUsers={this.props.connectedUsers}
                                   
                                />
                            } else return null
                        })}

                        <button className="list-right-btn" onClick={() => this.executeScroll(350)}><ArrowForwardIosIcon /></button>
                    </div>
                }

                {!this.props.genre && <div className="box-list full-grid ">
                    {this.props.boxes.map(box => <BoxPreview
                        isHomePage={false}
                        key={box._id}
                        box={box}
                        minimalUser={this.props.minimalUser}
                        onAddToFavorites={this.props.onAddToFavorites}
                        // onToggleLikeBox={this.props.onToggleLikeBox}
                        connectedUsers={this.props.connectedUsers}
                        onDelete={this.props.onDelete}
                    />
                    )}
                </div>}
            </section>
        )
    }
}
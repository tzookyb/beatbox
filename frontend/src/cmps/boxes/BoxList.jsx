// OUTSOURCE IMPORTS
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

// LOCAL IMPORTS
import { BoxPreview } from './BoxPreview'
import { utilService } from '../../services/utilService';

class _BoxList extends Component {
    state = {
        isScrolled: false,
        isScrollAvailable: undefined,
    }

    componentDidMount() {
        const isScrollAvailable = !!(this.ref.current?.offsetWidth - this.ref.current?.scrollWidth);
        this.setState({ isScrollAvailable });

        if (this.props.genre) this.intervalScroll();
    }

    componentWillUnmount() {
        this.pauseInterval()
    }

    intervalId;
    ref = React.createRef()

    executeScroll = utilService.executeScroll;

    intervalScroll = () => {
        this.intervalId = setInterval(() => {
            this.executeScroll(utilService.getRandomInteger(100, 300));
        }, 7000)
    }

    pauseInterval = () => {
        clearInterval(this.intervalId);
    }

    render() {
        const { genre, boxes, onDelete } = this.props;
        const { isScrolled, isScrollAvailable } = this.state;
        // if "genre" is provided that means we are on the home page.
        // no "genre" means we are on the boxes list.
        return (
            <section className="list-container">

                {genre && <React.Fragment>
                    <div className="genre-filter flex align-center space-between">
                        <h3 className="title-genre">{genre}</h3>
                        <Link to={`/box?&genre=${genre}`}> <h3 className="see-all-genre">See All →</h3></Link>
                    </div>

                    <div ref={this.ref} onMouseEnter={this.pauseInterval} onMouseLeave={this.intervalScroll} className={`box-list ${this.props.location.pathname === '/' ? 'homepage-list' : ''}`}>
                        {isScrolled && <button className="list-left-btn" onClick={() => this.executeScroll(-window.innerWidth / 2)}><ArrowBackIosIcon /></button>}

                        {boxes.map(box => {
                            if (box.genre === genre) {
                                return <BoxPreview
                                    key={box._id}
                                    box={box}
                                    genre={genre}
                                />
                            } else return null
                        })}

                        {isScrollAvailable && <button className="list-right-btn" onClick={() => this.executeScroll(window.innerWidth / 2)}><ArrowForwardIosIcon /></button>}
                    </div>
                </React.Fragment>
                }


                {!genre && <div className="box-list full-grid">
                    {boxes.map(box => <BoxPreview
                        key={box._id}
                        box={box}
                        onDelete={onDelete}
                    />
                    )}
                </div>}

            </section>
        )
    }
}
export const BoxList = withRouter(_BoxList);
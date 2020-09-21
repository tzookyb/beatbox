import React from 'react'
import { Link } from 'react-router-dom'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { BoxPreview } from './BoxPreview'

export function BoxList({ boxes, genre, onToggleLikeBox, minimalUser, onAddToFavorites }) {

    const ref = React.createRef()


    const executeScroll = (scrollTo) => {
        let scrollDiff = ref.current.scrollWidth - ref.current.offsetWidth
        console.dir(ref)
        if (ref.current.scrollLeft >= scrollDiff) ref.current.scrollLeft = 0
        else ref.current.scrollLeft += scrollTo
        console.log("executeScroll -> scrollTo", scrollTo)
        console.log("scrollToRef -> ref.current.scrollLeft", ref.current.scrollLeft)
        console.log("scrollToRef -> ref.current.scrollOffset", scrollDiff)
    }

    if (!boxes) return <h1>Loading...</h1>
    return (
        <section className={`list-container ${genre ? '' : 'main-container'}`}>

            {genre && <Link to={`/box?&genre=${genre}`} className="btn-genre">{genre}</Link>}
            {genre &&
                <div ref={ref} className="box-list image-container">
                    <button className= "list-left-btn" onClick={() => executeScroll(-350)}><ArrowBackIosIcon /></button>
                    {boxes.map(box => {
                        if (box.tags.includes(genre)) {
                            return <BoxPreview
                                isHomePage={true}
                                key={box._id}
                                box={box} genre={genre}
                                onToggleLikeBox={onToggleLikeBox}
                                onAddToFavorites={onAddToFavorites}
                                minimalUser={minimalUser}
                            />
                        } else return null
                    })}
                     <button className="list-right-btn" onClick={() => executeScroll(350)}><ArrowForwardIosIcon /></button>
                </div>
            }
            {!genre && <div className="box-list full-grid ">
                {boxes.map(box => <BoxPreview
                    isHomePage={false}
                    key={box._id}
                    box={box}
                    minimalUser={minimalUser}
                    onAddToFavorites={onAddToFavorites}
                />
                )}
            </div>}
        </section>
    )
}
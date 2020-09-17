import React from 'react'
import { Link } from 'react-router-dom'

import { BoxPreview } from './BoxPreview'

export function BoxList({ boxes, genre }) {


    if (!boxes) return <h1>Loading...</h1>
    return (
        <section className={`list-container ${genre ? '' : 'main-container'}`}>
            {/* {genre && <Link to={`/box?&genre=${genre}`} className="btn-genre">{genre}</Link>} */}
            {genre &&
                <div>
                    <Link to={`/box?&genre=${genre}`} className="btn-genre">{genre}</Link>
                    <div className="box-list image-container">
                        {boxes.map(box => {
                            if (box.tags.includes(genre)) {
                                return <BoxPreview key={box._id} box={box} genre={genre} />
                            } else return null
                        })}
                    </div>
                </div>
            }
            <div className="box-list full-grid ">
                {!genre && boxes.map(box => <BoxPreview key={box._id} box={box} />)}
            </div>
        </section>
    )
}
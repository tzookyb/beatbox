import React from 'react'

import { BoxPreview } from './BoxPreview'

export function BoxList({ boxes, genre }) {
    if (!boxes) return <h1>Loading...</h1>
    return (
        <section className="box-list">
            {genre && boxes.map(box => {
                    if (box.tags.includes(genre)){
                        return <BoxPreview key={box._id} box={box} genre={genre} />
                    } 
                })}
            {!genre && boxes.map(box => <BoxPreview key={box._id} box={box} />)}

        </section>
    )
}
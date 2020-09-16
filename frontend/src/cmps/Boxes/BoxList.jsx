import React from 'react'

import { BoxPreview } from './BoxPreview'

export function BoxList({ boxes, gener }) {
    if (!boxes) return <h1>Loading...</h1>
    // if (gener) var count = 5;
    return (
        <section className="box-list">
            {gener && boxes.map(box => {
                    if (box.tags.includes(gener)){
                        return <BoxPreview key={box._id} box={box} gener={gener} />
                    } 
                })}
            {!gener && boxes.map(box => <BoxPreview key={box._id} box={box} />)}

        </section>
    )
}
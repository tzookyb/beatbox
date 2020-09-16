import React from 'react'

import { BoxPreview } from './BoxPreview'

export function BoxList({ boxes }) {
    //TODO: Change <h1>Loading.. <h1>
    if (!boxes) return <h1>Loading...</h1>
    return (
        <section className="box-list">
            {boxes.map(box => <BoxPreview key={box._id} box={box} />)}
        </section>
    )
}


import React from 'react'
import { boxService } from '../services/boxService'

export function ButtonsFilter(props) {

    const genres = boxService.getGenres();
    return (
        <div className="btns-filter flex">
            {genres.map((genre,idx) => {
                return <button className="btn-filter" key={idx} onClick={() => props.onSetFilterGenre(genre)}>{genre}</button>
            })
            }
        </div>
    )
}

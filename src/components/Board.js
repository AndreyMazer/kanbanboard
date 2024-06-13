import React from 'react';
import ColumnContainer from './ColumnContainer';

export default class Board extends React.Component {
    
    render() {
        return (
            <section className="kanban">
                <h1 className='kanban_title'>Kanban Board</h1>
                <ColumnContainer/>
            </section>
        )
    }
}

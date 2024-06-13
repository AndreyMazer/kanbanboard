import React from 'react';
import Task from './Task.js'
import PropTypes from 'prop-types';

import { TaskContext } from './../context'

export default class Column extends React.Component {

    render() {

        const { Consumer: TaskConsumer } = TaskContext;

        const { columnTitle, limit, className } = this.props

        return (
            <div className={className}>
                <h2 className='column_title'>{columnTitle}</h2>
                <p className='task_limit'>Tasks limit: {limit}</p>
                <TaskConsumer>
                    {(context) => this.generateTaskList(context)}
                </TaskConsumer>
            </div>
        )
    }

    generateTaskList = (context) => {
        const { id } = this.props
        return context.tasks.filter(task => task.columnId == id).map(task =>
            <Task key={task.id} item={task} moveTask={context.moveTask} moveBackTask={context.moveBackTask} removeTask={context.removeTask}></Task>)
    }
}

Column.propTypes = {
    columnTitle: PropTypes.string,
    className: PropTypes.string,
    limit: PropTypes.number,
    id: PropTypes.number
}

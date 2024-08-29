import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faArrowRightLong, faArrowUpLong, faArrowDownLong, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function Task(props) {
    //const [elapsedTime, setElapsedTime] = useState(0);
    const [isOverdue, setIsOverdue] = useState(false);
    const task = props.item
    const { title, user, date } = task
    const { moveTask, moveBackTask, removeTask } = props

    // Проверка на просроченность
    useEffect(() => {
        const checkDueDate = () => {
            const currentDate = new Date();
            const dueDate = new Date(date);
            if (currentDate > dueDate) {
                setIsOverdue(true);
            }
        };

        checkDueDate(); // Проверяем при монтировании
        const interval = setInterval(checkDueDate, 60000); // Проверяем каждые 60 секунд
        return () => clearInterval(interval); // Очищаем интервал при размонтировании
    }, [date]);

    // Функция для форматирования даты
    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const day = String(dateObj.getDate()).padStart(2, '0'); // Получаем день
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Получаем месяц (месяцы начинаются с 0)
        const year = dateObj.getFullYear(); // Получаем год
        return `${day}.${month}.${year}`; // Возвращаем строку в нужном формате
    };

    return (
        <div className={`task ${isOverdue ? 'task__highlight' : ''}`}>
            <button onClick={() => removeTask(task)} className='task__delete'>{task.columnId !== 4 ? 'Х' : <FontAwesomeIcon icon={faCheckCircle} />}</button>
            <h3 className='task_tittle'>{title}</h3>
            <p className='task_user'>Делает: {user}</p>
            <p className='task_date'>Дедлайн: {formatDate(date)}</p> 
            {task.columnId !== 1 && (
                <button onClick={() => moveBackTask(task)} className='button__left btn_desktop button'>
                    <FontAwesomeIcon icon={faArrowLeftLong} />
                </button>
            )}
            {task.columnId !== 4 && (
                <button onClick={() => moveTask(task)} className='button__right btn_desktop button'>
                    <FontAwesomeIcon icon={faArrowRightLong} />
                </button>
            )}
            {task.columnId !== 1 && (
                <button onClick={() => moveBackTask(task)} className='button__left btn_mobile button'>
                    <FontAwesomeIcon icon={faArrowUpLong} />
                </button>
            )}
            {task.columnId !== 4 && (
                <button onClick={() => moveTask(task)} className='button__right btn_mobile button'>
                    <FontAwesomeIcon icon={faArrowDownLong} />
                </button>
            )}
        </div>
    );
}

Task.propTypes = {
    item: PropTypes.shape({
        title: PropTypes.string,
        user: PropTypes.string,
        date: PropTypes.string,
        columnId: PropTypes.number,
        id: PropTypes.number
    }),
    moveTask: PropTypes.func,
    moveBackTask: PropTypes.func,
    removeTask: PropTypes.func
}

export default Task

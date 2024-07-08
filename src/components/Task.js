import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faArrowRightLong, faArrowUpLong, faArrowDownLong, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function Task(props) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const task = props.item
    const { title, user } = task
    const { moveTask, moveBackTask, removeTask } = props

    const twentySeconds = 20 * 1000;

    // Получение времени из localStorage
    useEffect(() => {
        const storedTime = localStorage.getItem(`task-${task.id}-time`);
        if (storedTime) {
            setElapsedTime(parseInt(storedTime, 10));
        }
    }, []); // Запускается только один раз при монтировании компонента

    // Обновление таймера
    useEffect(() => {
        let timer;
        if (task.columnId !== 0) { // Проверяем, что столбец не равен 0
            timer = setInterval(() => {
                setElapsedTime(prevTime => {
                    const newTime = prevTime + 1000;
                    localStorage.setItem(`task-${task.id}-time`, newTime); // Сохраняем время в localStorage
                    return newTime;
                });
            }, 1000);
        }
        return () => {
            clearInterval(timer);
            localStorage.removeItem(`task-${task.id}-time`); // Удаляем время из localStorage при размонтировании
        };
    }, [task.columnId]); // Запускается при изменении task.columnId

    return (
        <div className={`task ${elapsedTime > twentySeconds ? 'task__highlight' : ''}`}>
            <button onClick={() => removeTask(task)} className='task__delete'>{task.columnId !== 4 ? 'Х' : <FontAwesomeIcon icon={faCheckCircle} />}</button>
            <h3 className='task_tittle'>{title}</h3>
            <p className='task_user'>Имя: {user}</p>
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
        columnId: PropTypes.number,
        id: PropTypes.number
    }),
    moveTask: PropTypes.func,
    moveBackTask: PropTypes.func,
    removeTask: PropTypes.func
}

export default Task

import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

function Form(props) {

    const init = { taskTitle: '', user: '', dueDate: ''}

    const reducer = (state, action) => {
        switch (action.type) {
        case 'reset':
            return init;
        case 'change':
            /*eslint-disable */
                const { name, value } = action.element;
     
            return { ...state, [name]: value };
        default:
            return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, init);
    const { taskTitle, user, dueDate } = state;

    const { getNewTask } = props;

    const [errors, setErrors] = useState({ taskTitle: '', user: '', dueDate: ''});

    const formValidation = () => {
        let validationErrors = { taskTitle: '', user: '' , dueDate: ''};

        if (taskTitle.length < 2) validationErrors.taskTitle = 'Минимальное количество символов - 2';
        if (user.length < 2) validationErrors.user = 'Минимальное количество символов - 2';
        if (taskTitle.length === 0) validationErrors.taskTitle = 'Что сделать-то надо?';
        if (user.length === 0) validationErrors.user = 'А отвественный-то кто?';
        if (dueDate.length === 0) validationErrors.dueDate = 'Когда закончишь?';

        setErrors(validationErrors);
        return validationErrors;
    };

    const addTask = (evt) => {
        evt.preventDefault();

        const validationErrors = formValidation();

        const currentDate = new Date();
        const selectedDate = new Date(dueDate);


        if (!validationErrors.taskTitle && !validationErrors.user && !validationErrors.dueDate) {
            // Проверяем, что дата не в прошлом
            if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
                validationErrors.dueDate = 'Дата не может быть в прошлом!';
            } else {
                const newTask = {
                    id: uuid(),
                    title: taskTitle,
                    user: user,
                    date: dueDate,
                    columnId: 1,
                };
                getNewTask(newTask);
                dispatch({ type: 'reset' });
                setErrors({ taskTitle: '', user: '', dueDate: ''}); // Сброс ошибок
            }
        } else {
        // Если есть ошибки валидации, обновляем состояние ошибок
            setErrors(validationErrors);
        }
    };

    return (
        <form className='form' onSubmit={addTask}>
            <div className='form__container'>
                <label className="form__area_title">
                    <input
                        name='taskTitle'
                        value={taskTitle}
                        type='text'
                        onChange={evt => dispatch({ type: 'change', element: evt.target })}
                        placeholder='задача'
                    />
                    {errors.taskTitle && <span className="form__error form__error_title">{errors.taskTitle}</span>}
                </label>
                <label className="form__area_user">
                    <input
                        name='user'
                        value={user}
                        type='text'
                        onChange={evt => dispatch({ type: 'change', element: evt.target })}
                        placeholder='ответственный'
                        pattern='^[a-zA-Zа-яА-ЯёЁ –-]+$'
                    />
                    {errors.user && <span className="form__error form__error_user">{errors.user}</span>}
                </label>
                <label className="form__area_dueDate">
                    <input
                        name='dueDate'
                        value={dueDate}
                        type='text'
                        onChange={evt => dispatch({ type: 'change', element: evt.target })}

                    />
                    {errors.dueDate && <span className="form__error form__error_dueDate">{errors.dueDate}</span>}
                </label>
                <input type="submit" value="ввод" className='form__submit' />
            </div>
        </form>
    );
}

Form.propTypes = {
    getNewTask: PropTypes.func.isRequired,
};

export default Form;

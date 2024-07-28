import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

function Form (props) {
    
    const init = {taskTitle:'', user:''}

    const reducer = (state, action) => {
        switch(action.type) {
        case 'reset':
            return init;
        case 'change':
            /*eslint-disable */
            const {name, value} = action.element;
            /*eslint-enable */
            return {...state, [name]:value};
        default:
            return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, init);
    const { taskTitle, user } = state;

    const { getNewTask } = props;

    const [errors, setErrors] = useState({ taskTitle: '', user: '' });

    const formValidation = () => {
        let validationErrors = { taskTitle: '', user: '' };

        if (taskTitle.length < 2) validationErrors.taskTitle = 'Минимальное количество символов - 2';
        if (user.length < 2) validationErrors.user = 'Минимальное количество символов - 2';
        if (taskTitle.length === 0) validationErrors.taskTitle = 'Поле должно быть заполнено';
        if (user.length === 0) validationErrors.user = 'Поле должно быть заполнено';

        setErrors(validationErrors);
        return validationErrors;
    };

    const addTask = (e) => {
        e.preventDefault();

        const validationErrors = formValidation();

        if (!validationErrors.taskTitle && !validationErrors.user) {
            const newTask = {
                id: uuid(),
                title: taskTitle,
                user: user,
                columnId: 1,
            };
            getNewTask(newTask);
            dispatch({ type: 'reset' });
            setErrors({ taskTitle: '', user: '' }); // Сброс ошибок
        }
    };

    return (
        <form className='form' onSubmit={addTask}>
            <div className='form__container'>
                <label>
                    <input
                        name='taskTitle'
                        value={taskTitle}
                        type='text'
                        onChange={e => dispatch({ type: 'change', element: e.target })}
                        placeholder='задача'
                    />
                    {errors.taskTitle && <span className="form__error form__error_title">{errors.taskTitle}</span>}
                </label>             
                <label>
                    <input
                        name='user'
                        value={user}
                        type='text'
                        onChange={e => dispatch({ type: 'change', element: e.target })}
                        placeholder='ответственный'
                        pattern='^[a-zA-Zа-яА-ЯёЁ –-]+$'
                    />
                    {errors.user && <span className="form__error form__error_user">{errors.user}</span>}
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

import React, { useState } from 'react';
import './App.css';
import Board from './components/Board.js'
import Form from './components/Form.js';
import InfoTooltip from './components/InfoToolTip.js';
import PopupDeleteCard from './components/PopupDeleteCard.js';

import { TaskContext, ColumnContext } from './context'

function App() {

    const columns = ([
        { id: 1, title: 'Нужно сделать', limit: 4, className: 'column ' },
        { id: 2, title: 'В процессе', limit: 4, className: 'column ' },
        { id: 3, title: 'Проверка', limit: 4, className: 'column ' },
        { id: 4, title: 'Готово', limit: 4, className: 'column ' }
    ])

    const tasksInMemory = JSON.parse(localStorage.getItem('task')) || [];
    const [tasks, setTasks] = useState(tasksInMemory)

    const setItem = (tasks) => {
        localStorage.setItem('task', JSON.stringify([...tasks]))
        setTasks(JSON.parse(localStorage.getItem('task')) || [])
    }

    const [infoTooltipIsOpen, setInfoTooltipIsOpen] = useState(false); // Создаем state для InfoTooltip
    const [infoTooltipStatus, setInfoTooltipStatus] = useState(false); // Создаем state для статуса InfoTooltip
    const [infoTooltipMessage, setInfoTooltipMessage] = useState('');
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); // Состояние для PopupDeleteCard
    const [taskToDelete, setTaskToDelete] = useState(null);

    const moveTask = task => {
        if (task.columnId === 4) { return }
        let taskList = [...tasks];
        const nextCol = task.columnId + 1
        const taskQty = taskList.filter((task) => task.columnId === nextCol).length

        if (taskQty < columns[nextCol - 1].limit) {
            taskList.forEach((oldElement) => {
                if (oldElement.id === task.id) {
                    oldElement.columnId++
                }
            })
            setItem(taskList)
            setInfoTooltipMessage("Задача успешно перемещена!");
            setInfoTooltipIsOpen(true);
            setInfoTooltipStatus(true);
        } else {
            setInfoTooltipIsOpen(true);
            setInfoTooltipStatus(false);
            setInfoTooltipMessage("Превышено кол-во задач на одном этапе.");
        }
    }

    const moveBackTask = task => {
        if (task.columnId === 1) { return }
        let taskList = [...tasks];
        const prevCol = task.columnId - 1
        const taskQty = taskList.filter((task) => task.columnId === prevCol).length

        if (taskQty < columns[prevCol - 1].limit) {
            taskList.forEach((oldElement) => {
                if (oldElement.id === task.id) {
                    oldElement.columnId--
                }
            })
            setItem(taskList)
            setInfoTooltipIsOpen(true);
            setInfoTooltipStatus(true);
            setInfoTooltipMessage("Задача успешно перемещена!");
        } else {
            setInfoTooltipIsOpen(true);
            setInfoTooltipStatus(false);
            setInfoTooltipMessage("Превышено кол-во задач на одном этапе.");
        }
    }

    const getNewTask = (newTask) => {
        const toDoTasks = [...tasks].filter((task) => task.columnId === 1).length

        if (toDoTasks < columns[0].limit) {
            localStorage.setItem('task', JSON.stringify([...tasks, newTask]))
            setTasks(JSON.parse(localStorage.getItem('task')) || [])
            setInfoTooltipIsOpen(true);
            setInfoTooltipStatus(true);
            setInfoTooltipMessage("Задача успешно создана!");
        } else {
            setInfoTooltipIsOpen(true);
            setInfoTooltipStatus(false);
            setInfoTooltipMessage("Лимит задач (4) превышен.");
        }
    }

    const removeTask = (task) => {
        // Открываем PopupDeleteCard с задачей, которую нужно удалить
        setIsDeletePopupOpen(true);
        setTaskToDelete(task);
    };

    const handleDeleteTask = () => {
        // Логика удаления задачи
        if (taskToDelete) {
            const tasksList = JSON.parse(localStorage.getItem('task'));
            const updateTasks = tasksList.filter(item => item.id !== taskToDelete.id);

            setItem(updateTasks);
            setInfoTooltipIsOpen(true);
            setInfoTooltipStatus(true);
            setInfoTooltipMessage("Задача завершена!");
            setIsDeletePopupOpen(false); // Закрываем PopupDeleteCard после удаления
            setTaskToDelete(null); // Сбрасываем состояние задачи для удаления
        }
    };

    const { Provider: TaskProvider } = TaskContext;
    const { Provider: ColumnProvider } = ColumnContext;

    return (
        <>
            <PopupDeleteCard
                isOpen={isDeletePopupOpen}
                onClose={() => setIsDeletePopupOpen(false)}
                onDelete={handleDeleteTask}
                removeTask={removeTask}
            />
            <InfoTooltip
                isOpen={infoTooltipIsOpen} // Передаем state в InfoTooltip
                onClose={() => setInfoTooltipIsOpen(false)} // Функция для закрытия InfoTooltip
                status={infoTooltipStatus}
                message={infoTooltipMessage} // Передаем статус в InfoTooltip 
            />
            <Form getNewTask={getNewTask} />
            <ColumnProvider value={{ columns }}>
                <TaskProvider value={{ tasks, moveTask, moveBackTask, removeTask }}>
                    <Board />
                </TaskProvider>
            </ColumnProvider>
        </>
    );
}

export default App;

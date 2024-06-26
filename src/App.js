import React,{useState} from 'react';
import './App.css';
import Board from './components/Board.js'
import Form from './components/Form.js';

import {TaskContext, ColumnContext} from './context'

function App() {

    const columns = ([
        { id: 1, title: 'Нужно сделать', limit: 4, className: 'column '},
        { id: 2, title: 'В процессе', limit: 4, className: 'column '},
        { id: 3, title: 'Проверка', limit: 4, className: 'column '},
        { id: 4, title: 'Готово', limit: 4, className: 'column '}
    ])

    const tasksInMemory = JSON.parse(localStorage.getItem('task')) || [];
    const [tasks, setTasks] = useState(tasksInMemory)

    const setItem = (tasks) => {
        localStorage.setItem('task', JSON.stringify([...tasks]))
        setTasks(JSON.parse(localStorage.getItem('task')) || [])
    }

    const moveTask = task => {
        if(task.columnId === 4) {return}
        let taskList = [...tasks]; 
        const nextCol = task.columnId+1
        const taskQty = taskList.filter((task) => task.columnId === nextCol).length

        if(taskQty <  columns[nextCol-1].limit) {
            taskList.forEach((oldElement) => {
                if(oldElement.id === task.id) {
                    oldElement.columnId++
                }    
            })
            setItem(taskList)
        } else {
            alert('Превышено кол-во задач на одном этапе')
        }
    }

    const moveBackTask = task => {
        if(task.columnId === 1) {return}
        let taskList = [...tasks]; 
        const prevCol = task.columnId-1
        const taskQty = taskList.filter((task) => task.columnId === prevCol).length

        if(taskQty <  columns[prevCol-1].limit) {
            taskList.forEach((oldElement) => {
                if(oldElement.id === task.id) {
                    oldElement.columnId--
                }    
            })
            setItem(taskList)
        } else {
            alert('Превышено кол-во задач на одном этапе')
        }
    }

    const getNewTask = (newTask) => { 
        const toDoTasks = [...tasks].filter((task) => task.columnId === 1).length

        if(toDoTasks < columns[0].limit) {
            localStorage.setItem('task', JSON.stringify([...tasks, newTask]))
            setTasks(JSON.parse(localStorage.getItem('task')) || [])
        } else {
            alert('Лимит задач (4) превышен')
        }
    }

    const removeTask = (task) => {
        if (window.confirm("Вы уверены, что хотите завершить задачу?") == true) {
            const tasksList =  JSON.parse(localStorage.getItem('task'))
            const updateTasks = tasksList.filter(item => item.id !== task.id)
            
            setItem(updateTasks)
        } else {
            window.alert("Удаление было отменено")
        }
    }

    const {Provider: TaskProvider} = TaskContext;
    const {Provider: ColumnProvider} = ColumnContext;

    return (
        <>
            <Form getNewTask={getNewTask}/>
            <ColumnProvider value={{columns}}>
                <TaskProvider value={{tasks,moveTask, moveBackTask, removeTask}}> 
                    <Board/>
                </TaskProvider> 
            </ColumnProvider>
        </>
    );
}

export default App;

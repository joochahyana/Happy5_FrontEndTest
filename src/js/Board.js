import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from './API.js';
import '../css/Board.css';
import { Task } from './Task.js';
import { Images } from './Images.js';

export const Board = (props) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        GetTasks();
    }, [props.id]);

    const GetTasks = () => {
        axios.get(`https://hapi5-api.herokuapp.com/boards/${props.id}/tasks`, {
            headers: {
                "Authorization": API.token
            }
        })
        .then( (response) => {
            // console.log(response);
            setTasks([]);
            if (response.data.length > 0) {
                response.data.map((task) =>
                    setTasks((prev) => [
                        ...prev,
                        {
                            "id": task.id,
                            "title": task.title,
                            "weight": task.weight
                        }
                    ])
                );
            }
        }, (error) => {
            console.log(error);
        });
    }

    // update board
    useEffect(() => {
        if (props.currBoardId === props.id) {
            GetTasks();
        }
    }, [props.newTaskName, props.newWeight]);

    return (
        <div className="board">
            <header className="board-header">
                <h1 className="board-header-year">{props.year}</h1>
                <h2 className="board-header-month">{props.month}</h2>
            </header>
            <div className="tasks">
                {tasks.length === 0 &&
                    <p className="no-task">No Task Available</p>
                }
                {tasks.length > 0 &&
                    tasks.map((task, index) => 
                        <Task
                            key={index}
                            boardIndex={props.index}
                            id={task.id}
                            taskName={task.title}
                            weight={task.weight}
                            onClickEditTask={props.onClickEditTask}
                            getTasks={GetTasks} />
                    )
                }
            </div>
            <div className="create-new-task-button clickable"
                onClick={() => props.onClickCreateNewTask(props.id)}>
                <img className="create-new-task-button-icon"
                    src={Images.imgPurplePlusIcon}
                    alt="puple-plus-icon" />
                <p className="create-new-task-text">Create new task</p>
            </div>
        </div>
    );
}
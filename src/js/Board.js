import React, { useEffect, useState } from 'react';
import { API } from './API.js';
import '../css/Board.css';
import { Task } from './Task.js';
import { Images } from './Images.js';

export const Board = (props) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        GetTasks();
    }, [props.id]);

    // update tasks
    useEffect(() => {
        if (props.currBoardId === props.id) {
            GetTasks();
        }
    }, [props.currBoardId]);

    // APIs
    const GetTasks = () => {
        API("get", `https://hapi5-api.herokuapp.com/boards/${props.id}/tasks`, null,
            (response) => {
                setTasks([]);
                if(response.data.length > 0) {
                    response.data.map((task) =>
                        setTasks((prev) => [
                            ...prev, {
                                "id": task.id,
                                "title": task.title,
                                "weight": task.weight
                            }
                        ])
                    );
                }
            }
        );
    }

    return (
        <div className="board border-radius-4">
            <header className="board-header">
                <h1 className="board-header-text font-12">{props.year}</h1>
                <h2 className="board-header-text bold">{props.month}</h2>
            </header>
            <div className="tasks">
                {tasks.length === 0 &&
                    <p className="no-task">No Task Available</p>
                }
                {tasks.length > 0 &&
                    tasks.map((task, index) => 
                        <Task
                            key={index}
                            boardIndex={props.index} // determine leftmost / rightmost / neither
                            boardId={props.id} // used in move task
                            id={task.id}
                            taskName={task.title}
                            weight={task.weight}
                            onClickMoveTask={props.onClickMoveTask}
                            onClickEditTask={props.onClickEditTask}
                            onClickDeleteTask={props.onClickDeleteTask}
                            onClickConfirmDelete={props.onClickConfirmDelete}
                            resetCurrBoardId={props.resetCurrBoardId}
                            getTasks={GetTasks} />
                    )
                }
            </div>
            <div className="create-new-task-button margin-4 clickable"
                onClick={() => props.onClickCreateNewTask(props.id)}>
                <img className="create-new-task-button-icon"
                    src={Images.imgPurplePlusIcon}
                    alt="puple-plus-icon" />
                <p className="create-new-task-text margin-8">Create new task</p>
            </div>
        </div>
    );
}
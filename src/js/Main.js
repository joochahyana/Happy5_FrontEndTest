import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from './API.js';
import { Board } from './Board.js';
import { DialogCreateTask } from './DialogCreateTask.js';
import { DialogDeleteTask } from './DialogDeleteTask.js';
import { Images } from './Images.js';
import '../css/Main.css';

const regex1to100 = /^[1-9][0-9]?$|^100$/;

export const Main = () => {
    const [boards, setBoards] = useState([]);
    // create task
    const [isCreateTaskDialogShowing, setIsCreateTaskDialogShowing] = useState(false); // show dialog
    const [currBoardId, setCurrBoardId] = useState(0); // selected board to create new task
    const [newTaskName, setNewTaskName] = useState(""); // trigger update board
    const [tempNewTaskName, setTempNewTaskName] = useState(""); // track changes when user types new task
    const [newWeight, setNewWeight] = useState(0); // trigger update board
    const [tempNewWeight, setTempNewWeight] = useState(0); // track changes when user types weight
    const [isWeightInputCorrect, setIsWeightInputCorrect] = useState(false); // check number 1-100
    // move task
    const [moveTaskNewBoardId, setMoveTaskNewBoardId] = useState(0); // trigger update board
    // delete task
    const [isDeleteTaskDialogShowing, setIsDeleteTaskDialogShowing] = useState(false); // show dialog
    const [deleteTaskId, setDeleteTaskId] = useState(0); // task to delete
    const [deleteTaskBoardId, setDeleteTaskBoardId] = useState(0); // trigger update board
    const [tempDeleteTaskBoardId, setTempDeleteTaskBoardId] = useState(0); // track board to update before confirm delete

    useEffect(() => {
        GetBoards();
    }, []);

    const GetBoards = () => {
        axios.get("https://hapi5-api.herokuapp.com/boards", {
            headers: {
                "Authorization": API.token
            }
        })
        .then( (response) => {
            // console.log(response);
            setBoards([]);
            if (response.data.length > 0) {
                response.data.map((board, index) =>
                    setBoards((prev) => [
                        ...prev,
                        {
                            "id": board.id,
                            "title": board.title,
                            "description": board.description,
                            "index": index
                        }
                    ])
                );
            }
        }, (error) => {
            console.log(error);
        });
    }

    const handleClickCloseDialog = () => {
        if (isCreateTaskDialogShowing) {
            setIsCreateTaskDialogShowing(false);
        }
        if (isDeleteTaskDialogShowing) {
            setIsDeleteTaskDialogShowing(false);
        }
    }

    // create new task
    const handleClickCreateNewTask = (boardId) => {
        setIsCreateTaskDialogShowing(true);
        setCurrBoardId(boardId);
        // reset variables
        setNewTaskName("");
        setTempNewTaskName("");
        setNewWeight(0);
        setTempNewWeight(0);
        setIsWeightInputCorrect(false);
    }

    const handleClickSaveTask = () => {
        if (tempNewTaskName.length > 0 && isWeightInputCorrect) {
            CreateTask();
            handleClickCloseDialog();
        } else {
            console.log("incorrect weight input");
        }
    }

    const handleChangeTaskName = ({target}) => {
        setTempNewTaskName(target.value);
    }

    const handleChangeWeight = ({target}) => {
        setIsWeightInputCorrect(regex1to100.test(target.value));
        setTempNewWeight(target.value);
    }

    const CreateTask = () => {
        axios.post(`https://hapi5-api.herokuapp.com/boards/${currBoardId}/tasks`, {
            "title": tempNewTaskName,
            "weight": parseInt(tempNewWeight)
        }, {
            headers: {
                "Authorization": API.token
            }
        })
        .then( (response) => {
            // console.log(response);
            setNewTaskName(tempNewTaskName);
            setNewWeight(parseInt(tempNewWeight));
        }, (error) => {
            console.log(error);
        });
    }
    
    // move task
    const handleClickMoveTask = (newBoardId) => {
        setMoveTaskNewBoardId(newBoardId);
    }

    // delete task
    const handleClickDeleteTask = (taskId, boardId) => {
        setIsDeleteTaskDialogShowing(true);
        setDeleteTaskId(taskId);
        setTempDeleteTaskBoardId(boardId);
        console.log(deleteTaskId);
        console.log(tempDeleteTaskBoardId);
    }

    const handleClickConfirmDeleteTask = () => {
        console.log("test - delete");
        DeleteTask();
        handleClickCloseDialog();
    }

    const DeleteTask = () => {
        axios.delete(`https://hapi5-api.herokuapp.com/tasks/${deleteTaskId}`, {
            headers: {
                "Authorization": API.token
            }
        })
        .then( (response) => {
            console.log(response);
            setDeleteTaskBoardId(tempDeleteTaskBoardId); // update board
        }, (error) => {
            console.log(error);
        });
    }

    return (
        <div>
            <div className="side-bar">
                <img className="side-bar-logo"
                    src={Images.imgHappy5Logo}
                    alt="Happy5-logo" />
            </div>
            <div className="main">
                <header>
                    <h1 className="main-header">Product Roadmap</h1>
                </header>
                <div className ="boards">
                    {boards.length > 0 &&
                        boards.map((board) =>
                            <Board
                                key={board.id}
                                id={board.id}
                                year={board.title}
                                month={board.description}
                                index={board.index}
                                currBoardId={currBoardId}
                                newTaskName={newTaskName}
                                newWeight={newWeight}
                                moveTaskNewBoardId={moveTaskNewBoardId}
                                deleteTaskBoardId={deleteTaskBoardId}
                                onClickCreateNewTask={handleClickCreateNewTask}
                                onClickMoveTask={handleClickMoveTask}
                                onClickDeleteTask={handleClickDeleteTask} />
                        )
                    }
                </div>
                {isCreateTaskDialogShowing &&
                    <DialogCreateTask
                        onClickCloseDialog={handleClickCloseDialog}
                        onChangeTaskName={handleChangeTaskName}
                        onChangeWeight={handleChangeWeight}
                        onClickSaveTask={handleClickSaveTask} />
                }
                {isDeleteTaskDialogShowing &&
                    <DialogDeleteTask
                        onClickCloseDialog={handleClickCloseDialog}
                        onClickComfirmDeleteTask={handleClickConfirmDeleteTask} />
                }
            </div>
        </div>
    );
}
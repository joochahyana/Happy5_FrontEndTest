import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from './API.js';
import { Board } from './Board.js';
import { DialogCreateEditTask } from './DialogCreateEditTask.js';
import { DialogDeleteTask } from './DialogDeleteTask.js';
import { Images } from './Images.js';
import '../css/Main.css';

const regex1to100 = /^[1-9][0-9]?$|^100$/;

export const Main = () => {
    const [boards, setBoards] = useState([]);
    // create task
    const [tempCurrBoardId, setTempCurrBoardId] = useState(-1); // selected board to add new task
    // create and edit task
    const [isCreateTaskDialogShowing, setIsCreateTaskDialogShowing] = useState(false); // show dialog
    const [isCreateNewTask, setIsCreateNewTask] = useState(true); // create or edit task
    const [currBoardId, setCurrBoardId] = useState(-1); // trigger update board
    const [newTaskName, setNewTaskName] = useState(""); // new or edited task name
    const [newWeight, setNewWeight] = useState(0); // new or edited weight
    const [isWeightInputCorrect, setIsWeightInputCorrect] = useState(false); // check number 1-100
    // delete task
    const [isDeleteTaskDialogShowing, setIsDeleteTaskDialogShowing] = useState(false); // show dialog
    // edit and delete task
    const [currTaskId, setCurrTaskId] = useState(0); // task to edit
    // 
    const [isNewerTaskOnTop, setIsNewerTaskOnTop] = useState(false); // 

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
            setIsCreateNewTask(true);
            setCurrBoardId(-1);
        }
        if (isDeleteTaskDialogShowing) {
            setIsDeleteTaskDialogShowing(false);
        }
    }

    // create new task
    const handleClickCreateNewTask = (boardId) => {
        setIsCreateNewTask(true);
        setTempCurrBoardId(boardId);
        setNewTaskName("");
        setNewWeight(0);
        setIsWeightInputCorrect(false);
        setIsNewerTaskOnTop(false);
        // show dialog
        setIsCreateTaskDialogShowing(true);
    }

    // edit task
    const handleClickEditTask = (taskId, boardId) => {
        // setIsCreateTaskDialogShowing(true);
        setIsCreateNewTask(false);
        setCurrTaskId(taskId);
        GetTask(taskId);
        setTempCurrBoardId(boardId);
    }
    
    // create or edit task
    const handleClickSaveTask = () => {
        if (newTaskName.length > 0 && isWeightInputCorrect) {
            if (isCreateNewTask) {
                CreateTask();
            } else {
                EditTask();
            }
            handleClickCloseDialog();
        } else {
            if (newTaskName.length <= 0) {
                console.log("task name cannot be empty");
            }
            if (!isWeightInputCorrect) {
                console.log("incorrect weight input");
            }
        }
    }

    const handleChangeTaskName = ({target}) => {
        setNewTaskName(target.value);
    }

    const handleChangeWeight = ({target}) => {
        setIsWeightInputCorrect(regex1to100.test(target.value));
        setNewWeight(target.value);
    }

    // move task
    const handleClickMoveTask = (newBoardId) => {
        setIsNewerTaskOnTop(true);
        setCurrBoardId(tempCurrBoardId); // update prev board
        setCurrBoardId(newBoardId); // update new board
        setCurrBoardId(-1);
    }

    // delete task
    const handleClickDeleteTask = (taskId, boardId) => {
        setIsDeleteTaskDialogShowing(true);
        setCurrTaskId(taskId);
        setTempCurrBoardId(boardId);
        setCurrBoardId(-1);
        setIsNewerTaskOnTop(false);
    }

    const handleClickConfirmDeleteTask = () => {
        DeleteTask();
        handleClickCloseDialog();
    }

    // APIs
    // used in create new task
    const CreateTask = () => {
        axios.post(`https://hapi5-api.herokuapp.com/boards/${tempCurrBoardId}/tasks`, {
            "title": newTaskName,
            "weight": parseInt(newWeight)
        }, {
            headers: {
                "Authorization": API.token
            }
        })
        .then( (response) => {
            // console.log(response);
            setCurrBoardId(tempCurrBoardId);
        }, (error) => {
            console.log(error);
        });
    }

    // used in edit task
    const GetTask = (taskId) => {
        axios.get(`https://hapi5-api.herokuapp.com/tasks/${taskId}`, {
            headers: {
                "Authorization": API.token
            }
        })
        .then( (response) => {
            // console.log(response);
            setNewTaskName(response.data.title);
            setNewWeight(response.data.weight);
            // show dialog after get task done
            setIsCreateTaskDialogShowing(true);
        }, (error) => {
            console.log(error);
        });
    }

    // used in edit task
    const EditTask = () => {
        axios.put(`https://hapi5-api.herokuapp.com/tasks/${currTaskId}`, {
            "title": newTaskName,
            "weight": parseInt(newWeight)
        }, {
            headers: {
                "Authorization": API.token
            }
        })
        .then( (response) => {
            // console.log(response);
            setCurrBoardId(tempCurrBoardId);
        }, (error) => {
            console.log(error);
        });
    }

    // used in delete task
    const DeleteTask = () => {
        axios.delete(`https://hapi5-api.herokuapp.com/tasks/${currTaskId}`, {
            headers: {
                "Authorization": API.token
            }
        })
        .then( (response) => {
            // console.log(response);
            setCurrBoardId(tempCurrBoardId); // update board
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
                                isNewerTaskOnTop={isNewerTaskOnTop}
                                onClickCreateNewTask={handleClickCreateNewTask}
                                onClickMoveTask={handleClickMoveTask}
                                onClickEditTask={handleClickEditTask}
                                onClickDeleteTask={handleClickDeleteTask} />
                        )
                    }
                </div>
                {isCreateTaskDialogShowing &&
                    <DialogCreateEditTask
                        isCreateNewTask={isCreateNewTask}
                        taskName={newTaskName}
                        weight={newWeight}
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
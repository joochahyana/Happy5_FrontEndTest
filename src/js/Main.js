import React, { useEffect, useState } from 'react';
import { API } from './API.js';
import { Board } from './Board.js';
import { DialogCreateEditTask } from './DialogCreateEditTask.js';
import { DialogDeleteTask } from './DialogDeleteTask.js';
import { Images } from './Images.js';
import '../css/Main.css';

const regex1to100 = /^[1-9][0-9]?$|^100$/;

export const Main = () => {
    const [boards, setBoards] = useState([]);
    const [tempCurrBoardId, setTempCurrBoardId] = useState(-1); // selected board
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

    useEffect(() => {
        GetBoards();
    }, []);

    // click close or cancel > DialogCreateEditTask, DialogDeleteTask
    const handleClickCloseDialog = () => {
        if (isCreateTaskDialogShowing) {
            setIsCreateTaskDialogShowing(false);
            setIsCreateNewTask(true);
        }
        if (isDeleteTaskDialogShowing) {
            setIsDeleteTaskDialogShowing(false);
        }
    }

    // click create new task > Board
    const handleClickCreateNewTask = (boardId) => {
        setIsCreateNewTask(true);
        setTempCurrBoardId(boardId);
        setCurrBoardId(-1);
        setNewTaskName("");
        setNewWeight(0);
        setIsWeightInputCorrect(false);
        setIsCreateTaskDialogShowing(true);
    }

    // click edit task > Task
    const handleClickEditTask = (taskId, boardId) => {
        setIsCreateNewTask(false);
        setCurrTaskId(taskId);
        GetTask(taskId);
        setTempCurrBoardId(boardId);
        setCurrBoardId(-1);
    }
    
    // click save task > DialogCreateEditTask
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

    // track task name input change > DialogCreateEditTask
    const handleChangeTaskName = ({target}) => {
        setNewTaskName(target.value);
    }

    // track weight input change > DialogCreateEditTask
    const handleChangeWeight = ({target}) => {
        setIsWeightInputCorrect(regex1to100.test(target.value));
        setNewWeight(target.value);
    }

    // click move task > Task
    const handleClickMoveTask = (newBoardId) => {
        setCurrBoardId(newBoardId); // update new board
    }

    // click delete task > Task
    const handleClickDeleteTask = (taskId, boardId) => {
        setIsDeleteTaskDialogShowing(true);
        setCurrTaskId(taskId);
        setTempCurrBoardId(boardId);
        setCurrBoardId(-1);
    }

    // click delete > DialogDeleteTask
    const handleClickConfirmDeleteTask = () => {
        DeleteTask();
        handleClickCloseDialog();
    }

    // reset currBoardId
    const resetCurrBoardId = () => {
        setCurrBoardId(-1);
    }

    // APIs
    // used to show boards
    const GetBoards = () => {
        API("get", "https://hapi5-api.herokuapp.com/boards", null,
            (response) => {
                setBoards([]);
                if (response.data.length > 0) {
                    response.data.map((board, index) =>
                        setBoards((prev) => [
                            ...prev, {
                                "id": board.id,
                                "title": board.title,
                                "description": board.description,
                                "index": index
                            }
                        ])
                    );
                }
            }
        );
    }

    // used in create new task
    const CreateTask = () => {
        API("post", `https://hapi5-api.herokuapp.com/boards/${tempCurrBoardId}/tasks`, {
                "title": newTaskName,
                "weight": parseInt(newWeight)
            }, (response) => {
                setCurrBoardId(tempCurrBoardId);
            }
        );
    }

    // used in edit task
    const GetTask = (taskId) => {
        API("get", `https://hapi5-api.herokuapp.com/tasks/${taskId}`, null,
            (response) => {
                setNewTaskName(response.data.title);
                setNewWeight(response.data.weight);
                setIsCreateTaskDialogShowing(true);
            }
        );
    }

    // used in edit task
    const EditTask = () => {
        API("put", `https://hapi5-api.herokuapp.com/tasks/${currTaskId}`, {
                "title": newTaskName,
                "weight": parseInt(newWeight)
            }, (response) => {
                setCurrBoardId(tempCurrBoardId);
            }
        );
    }

    // used in delete task
    const DeleteTask = () => {
        API("delete", `https://hapi5-api.herokuapp.com/tasks/${currTaskId}`, null,
            (response) => {
                setCurrBoardId(tempCurrBoardId);
            }
        );
    }

    return (
        <div>
            <div className="side-bar">
                <img className="side-bar-logo margin-20"
                    src={Images.imgHappy5Logo}
                    alt="Happy5-logo" />
            </div>
            <div className="main">
                <header>
                    <h1 className="main-header font-20 bold">Product Roadmap</h1>
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
                                onClickCreateNewTask={handleClickCreateNewTask}
                                onClickMoveTask={handleClickMoveTask}
                                onClickEditTask={handleClickEditTask}
                                onClickDeleteTask={handleClickDeleteTask}
                                resetCurrBoardId={resetCurrBoardId} />
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
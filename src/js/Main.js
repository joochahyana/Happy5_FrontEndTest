import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from './API.js';
import { Board } from './Board.js';
import { DialogCreateTask } from './DialogCreateTask.js';
import { Images } from './Images.js';
import '../css/Main.css';

const regex1to100 = /^[1-9][0-9]?$|^100$/;

export const Main = () => {
    const [boards, setBoards] = useState([]);

    const [isDialogShowing, setIsDialogShowing] = useState(false);
    const [currBoardId, setCurrBoardId] = useState(0); // selected board to create new task
    const [newTaskName, setNewTaskName] = useState(""); // trigger update board
    const [tempNewTaskName, setTempNewTaskName] = useState(""); // track changes when user types new task
    const [newWeight, setNewWeight] = useState(0); // trigger update board
    const [tempNewWeight, setTempNewWeight] = useState(0); // track changes when user types weight
    const [isWeightInputCorrect, setIsWeightInputCorrect] = useState(false); // check number 1-100

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
            if (response.data.length > 0){
                response.data.map((board) =>
                    setBoards((prev) => [
                        ...prev,
                        {
                            "id": board.id,
                            "title": board.title,
                            "description": board.description
                        }
                    ])
                );
            }
        }, (error) => {
            console.log(error);
        });
    }

    // create new task
    const handleClickCreateNewTask = (boardId) => {
        setIsDialogShowing(true);
        setCurrBoardId(boardId);
        // reset variables
        setNewTaskName("");
        setTempNewTaskName("");
        setNewWeight(0);
        setTempNewWeight(0);
        setIsWeightInputCorrect(false);
    }

    const handleClickCloseDialog = () => {
        setIsDialogShowing(false);
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
            console.log(response);
            setNewTaskName(tempNewTaskName);
            setNewWeight(parseInt(tempNewWeight));
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
                                currBoardId={currBoardId}
                                newTaskName={newTaskName}
                                newWeight={newWeight}
                                onClickCreateNewTask={handleClickCreateNewTask} />
                        )
                    }
                </div>
                {isDialogShowing &&
                <DialogCreateTask
                    onClickCloseDialog={handleClickCloseDialog}
                    onChangeTaskName={handleChangeTaskName}
                    onChangeWeight={handleChangeWeight}
                    onClickSaveTask={handleClickSaveTask} />
                }
            </div>
        </div>
    );
}
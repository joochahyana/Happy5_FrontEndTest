import React, { useState, useEffect } from 'react';
import '../css/Dialog.css';
import { Images } from './Images.js';

export const DialogCreateEditTask = (props) => {
    const [headerText, setHeaderText] = useState("Create Task");
    const [taskNameValue, setTaskNameValue] = useState("");
    const [weightValue, setWeightValue] = useState("");
    
    useEffect(() => {
        if (props.isCreateNewTask){ // create new task
            setHeaderText("Create Task");
            setTaskNameValue("");
            setWeightValue("");
        } else { // edit task
            setHeaderText("Edit Task");
            setTaskNameValue(props.taskName);
            setWeightValue(props.weight);
        }
    }, [props.isCreateNewTask]);
    
    return (
        <div className="overlay">
            <div className="dialog-create-edit-task border-radius-4 bg-white">
                <header className="dialog-header">
                    <h1 className="dialog-header-text font-20 bold">{headerText}</h1>
                    <img className="dialog-button-close clickable"
                        src={Images.imgCloseIcon}
                        alt="close-icon"
                        onClick={props.onClickCloseDialog} />
                </header>
                <div className="dialog-content">
                    <div className="dialog-content-task-name">
                        <p className="dialog-content-text">Task Name</p>
                        <input className="dialog-input-task-name bold border-radius-4"
                            type="text"
                            placeholder="example: Build rocket to Mars."
                            defaultValue={taskNameValue}
                            onChange={props.onChangeTaskName} />
                    </div>
                    <div className="dialog-content-weight border-radius-4">
                        <p className="dialog-content-text">Weight</p>
                        <input className="dialog-input-weight"
                            type="number"
                            placeholder="0%"
                            defaultValue={weightValue}
                            onWheel={(e) => e.target.blur()}
                            onChange={props.onChangeWeight} />
                    </div>
                    <div className="dialog-buttons">
                        <input className="dialog-button-cancel border-radius-4 clickable bg-white"
                            type="button"
                            value="Cancel"
                            onClick={props.onClickCloseDialog} />
                        <input className="dialog-button-save-task border-radius-4 clickable"
                            type="button"
                            value="Save Task"
                            onClick={props.onClickSaveTask} />
                    </div>
                </div>
            </div>
        </div>
    );
}
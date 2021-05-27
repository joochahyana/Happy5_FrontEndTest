import React from 'react';
import '../css/Dialog.css';
import { Images } from './Images.js';

export const DialogCreateTask = (props) => {
    return (
        <div className="overlay">
            <div className="dialog-create-edit-task">
                <img className="dialog-base"
                    src={Images.imgDialogBase}
                    alt="dialog-base"
                    draggable="false" />
                <header className="dialog-header">
                    <h1 className="dialog-header-text">Create New Task</h1>
                    <img className="dialog-button-close clickable"
                        src={Images.imgCloseIcon}
                        alt="close-icon"
                        onClick={props.onClickCloseDialog} />
                </header>
                <div className="dialog-content">
                    <div className="dialog-content-task-name">
                        <p className="dialog-content-text">Task Name</p>
                        <input className="dialog-input-task-name"
                            type="text"
                            placeholder="example: Build rocket to Mars."
                            onChange={props.onChangeTaskName} />
                    </div>
                    <div className="dialog-content-weight">
                        <p className="dialog-content-text">Weight</p>
                        <input className="dialog-input-weight"
                            type="text"
                            placeholder="0%"
                            onChange={props.onChangeWeight} />
                    </div>
                    <div className="dialog-buttons">
                        <input className="dialog-button-cancel clickable"
                            type="button"
                            value="Cancel"
                            onClick={props.onClickCloseDialog} />
                        <input className="dialog-button-save-task clickable"
                            type="button"
                            value="Save Task"
                            onClick={props.onClickSaveTask} />
                    </div>
                </div>
            </div>
        </div>
    );
}
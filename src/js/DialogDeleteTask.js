import React from 'react';
import '../css/Dialog.css';
import { Images } from './Images.js';

export const DialogDeleteTask = (props) => {
    return (
        <div className="overlay">
            <div className="dialog-delete-task border-radius-4 bg-white">
                <header className="dialog-header">
                    <h1 className="dialog-header-text font-20 bold">Delete Task</h1>
                    <img className="dialog-button-close clickable"
                        src={Images.imgCloseIcon}
                        alt="close-icon"
                        onClick={props.onClickCloseDialog} />
                </header>
                <div className="dialog-content">
                    <p className="dialog-delete-text">Are you sure want to delete this task? your action can't be reverted.</p>
                    <div className="dialog-buttons">
                        <input className="dialog-button-cancel clickable"
                            type="button"
                            value="Cancel"
                            onClick={props.onClickCloseDialog} />
                        <input className="dialog-button-delete clickable"
                            type="button"
                            value="Delete"
                            onClick={props.onClickComfirmDeleteTask} />
                    </div>
                </div>
            </div>
        </div>
    );
}
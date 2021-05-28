import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from './API.js';
import '../css/Task.css';
import { Images } from './Images.js';

export const Task = (props) => {
    const[isPopupOpen, setIsPopupOpen] = useState(false);
    
    const myRef = React.createRef();

    useEffect(() => {
        if (isPopupOpen) {
            window.addEventListener('mousedown', closePopup, false);
            return() => window.removeEventListener('mousedown', closePopup, false);
        }
    });
  
    const closePopup = (e) => {
        if (myRef.current.contains(e.target)) {
            return;
        }
        setIsPopupOpen(false);
    }

    const handleClickTogglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    }

    // move task
    const handleClickMoveTask = (isMoveLeft) => {
        let newBoardId = props.boardId;
        newBoardId += isMoveLeft ? -1 : 1;
        
        axios.put(`https://hapi5-api.herokuapp.com/tasks/${props.id}/move/target/${newBoardId}`, {

        }, {
            headers: {
                "Authorization": API.token
            }
        })
        .then( (response) => {
            // console.log(response);
            props.getTasks(true); // update prev board
            props.onClickMoveTask(newBoardId); // update new board
        }, (error) => {
            console.log(error);
        });
    }
    
    return (
        <div className="task border-radius-4 bg-white">
            <p className="task-name margin-16 bold">{props.taskName}</p>
            <div className="task-weight">
                <img className="weight-icon"
                    src={Images.imgWeightIcon}
                    alt="weight-icon" />
                <p className="weight-text">{props.weight}%</p>
            </div>
            <div className="task-options"
                ref={myRef}>
                <div className="task-options-button margin-8 border-radius-4 bg-white clickable"
                    onClick={handleClickTogglePopup} >
                        <img className="task-options-button-icon"
                            src={Images.imgMore}
                            alt="task-options-icon" />
                    {isPopupOpen &&
                    <div className={(props.boardIndex === 0 || props.boardIndex === 3) ? "task-options-popup-3" : "task-options-popup-4"}>
                        <div className="task-options-popup-base border-radius-4 bg-white"></div>
                        {props.boardIndex !== 0 && // not leftmost board
                            <div className="task-option clickable"
                                onClick={() => handleClickMoveTask(true)}>
                                <img className="task-option-icon"
                                    src={Images.imgLeftArrowIcon}
                                    alt="left-arrow-icon" />
                                <p className="task-option-text">Move Left</p>
                            </div>
                        }
                        {props.boardIndex !== 3 && // not rightmost board
                            <div className="task-option clickable"
                                onClick={() => handleClickMoveTask(false)} >
                                <img className="task-option-icon"
                                    src={Images.imgRightArrowIcon}
                                    alt="right-arrow-icon" />
                                <p className="task-option-text">Move Right</p>
                            </div>
                        }
                        <div className="task-option clickable"
                            onClick={() => props.onClickEditTask(props.id, props.boardId)} >
                            <img className="task-option-icon"
                                src={Images.imgEditIcon}
                                alt="edit-icon" />
                            <p className="task-option-text">Edit</p>
                        </div>
                        <div className="task-option clickable"
                            onClick={() => props.onClickDeleteTask(props.id, props.boardId)} >
                            <img className="task-option-icon"
                                src={Images.imgDeleteIcon}
                                alt="delete-icon"/>
                            <p className="task-option-text">Delete</p>
                        </div>
                    </div>
                }
                </div>
            </div>
        </div>
    );
}
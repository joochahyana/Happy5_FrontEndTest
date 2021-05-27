import React, { useEffect, useState } from 'react';
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
    
    return (
        <div className="task">
            <p className="task-name">{props.taskName}</p>
            <div className="task-weight">
                <img className="weight-icon"
                    src={Images.imgWeightIcon}
                    alt="weight-icon" />
                <p className="weight-text">{props.weight}%</p>
            </div>
            <div className="task-options"
                ref={myRef}>
                <div className="task-options-button clickable"
                    onClick={handleClickTogglePopup} >
                        <img className="task-options-button-icon"
                            src={Images.imgMore}
                            alt="task-options-icon" />
                    {isPopupOpen &&
                    <div className={(props.index === 0 || props.index === 3) ? "task-options-popup-3" : "task-options-popup-4"}>
                        <img className="task-options-popup-base"
                            src={Images.imgDialogBase}
                            alt="popup-base" />
                        {props.index !== 0 && // not leftmost board
                            <div className="task-option clickable">
                                <img className="task-option-icon"
                                    src={Images.imgLeftArrowIcon}
                                    alt="left-arrow-icon" />
                                <p className="task-option-text">Move Left</p>
                            </div>
                        }
                        {props.index !== 3 && // not rightmost board
                            <div className="task-option clickable">
                                <img className="task-option-icon"
                                    src={Images.imgRightArrowIcon}
                                    alt="right-arrow-icon" />
                                <p className="task-option-text">Move Right</p>
                            </div>
                        }
                        <div className="task-option clickable">
                            <img className="task-option-icon"
                                src={Images.imgEditIcon}
                                alt="edit-icon" />
                            <p className="task-option-text">Edit</p>
                        </div>
                        <div className="task-option edit-task-bottom-option clickable">
                            <img className="task-option-icon"
                                src={Images.imgDeleteIcon}
                                alt="delete-icon " />
                            <p className="task-option-text">Delete</p>
                        </div>
                    </div>
                }
                </div>
            </div>
        </div>
    );
}
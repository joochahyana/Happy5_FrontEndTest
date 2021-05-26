import React from 'react';
import '../css/Board.css';

export const Board = (props) => {
    return (
        <div className="board">
            <header className="board-header">
                <h1 className="board-header-year">{props.year}</h1>
                <h2 className="board-header-month">{props.month}</h2>
            </header>
        </div>
    );
}
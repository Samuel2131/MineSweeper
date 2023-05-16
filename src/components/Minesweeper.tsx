
import React, { useEffect, useState } from "react";
//💣🚩😆

type cellProps = {
    value: number;
    isFlag: boolean;
    isBomb: boolean;
    isShown: boolean;
}

const defaultCell: cellProps = {
    value: 0,
    isFlag: false,
    isBomb: false,
    isShown: false
}

const ROW = 8;
const COL = 8; 

export const Minessweeper = () => {
    const [board, setBoard] = useState<JSX.Element[][]>([]);

    const clickCell = (row: number, col: number) => {
        if(board.length <= 0) return;
        board[row][col] = getItem(row, col, {value: 0, isShown: false, isFlag: false, isBomb: true});
        setBoard([...board]); 
    }

    const getItem = (row: number, col: number, props: cellProps) => {
        const {value, isBomb, isFlag, isShown} = props;
        const shadow = isShown ? "none" : "inset 2px 2px 2px 2px #dedede";
        return <div className="col box" onClick={() => clickCell(row, col)} style={{width: 40, height:30, boxShadow: shadow}}>{isShown ? value : isFlag ? '🚩' : isBomb ? '💣' : null}</div>;
    }

    const initBoard = () => {
        for(let i=0;i<ROW;i++) {
            let arr = [];
            for(let j=0;j<COL;j++) arr.push(getItem(i, j, defaultCell));
            board.push(arr);
        }
        setBoard([...board]);
    }

    useEffect(() => {
        if(board.length === 0) initBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <div className="d-flex mb-5">
            <div>
                <h1 className="fs-3 mb-5">Minesweeper game!</h1>
                <div className="container game-board">
                    {React.Children.toArray(board.map((arr, i) => {
                        return <div className="row">{React.Children.toArray(arr.map((_, j) => board[i][j]))}</div>;
                    }))}
                </div>
            </div>
        </div>
    );
}
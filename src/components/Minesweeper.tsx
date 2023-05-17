
import React, { useEffect, useState } from "react";
import { Cell, CellProps } from "./cell";
//💣🚩😆

const ROW = 8;
const COL = 8; 
const BOMB_PERCENTAGE = 0.2;

//add numbers color, add emoji win and lose, control checkWin, add color bomb cell
export const Minessweeper = () => {
    const [board, setBoard] = useState<JSX.Element[][]>(Array.from({length: ROW}, () => Array.from({length: COL})));
    const [flag, setFlag] = useState<boolean>(false);
    const [win, setWin] = useState<"Win" | "Lose" | "InProgess">("InProgess");

    const countBomb = ({row, col}: CellProps): number => {
        let count = 0;
        for(let i=row-1;i<=row+1;i++){
            for(let j=col-1;j<=col+1;j++){
                try{
                    if(!(i === row && j === col) && board![i][j].props.cell.isBomb) count++;
                }catch(e){};
            }
        }
        return count;
    }

    const setFlagInBoard = (cell : CellProps) => {
        cell.isFlag = !cell.isFlag;
        board[cell.row][cell.col] = <Cell cell={cell} clickCell={setCellClickFunction}/>;
        setBoard([...board]);
    }

    const setCellClickFunction = () => {
        for(let i=0;i<ROW;i++){
            for(let j=0;j<COL;j++) {
                board[i][j] = <Cell cell={board[i][j].props.cell} clickCell={!flag ? setFlagInBoard : clickCell}/>
            }
        }
        setFlag(!flag);
        setBoard([...board]);
    }

    const checkWin = () => board.every((arr) => arr.every((val) => (val.props.cell.isShown) || (!val.props.cell.isShown && val.props.cell.isBomb)));

    const clickCell = (cell : CellProps) => {
        if(board.length === 0) return;
        if(!cell.isShown){
            cell.isShown = true
            cell.value = countBomb(cell);
            if(cell.isFlag) {
                cell.isShown = false;
            }
            if(cell.value === 0 && !cell.isBomb && !cell.isFlag){
                for(let i=cell.row-1;i<=cell.row+1;i++){
                    for(let j=cell.col-1;j<=cell.col+1;j++){
                        if(((i>=0 && i<ROW) && (j>=0 && j<COL)) && !(i === cell.row && j === cell.col)) clickCell(board[i][j].props.cell);
                    }
                }
            }
            board[cell.row][cell.col] = <Cell cell={cell} clickCell={clickCell}/>;
            setBoard([...board]);
            if(cell.isBomb) setWin("Lose"); 
        }
    }

    const initBoard = () => {
        for(let i=0;i<ROW;i++) {
            for(let j=0;j<COL;j++) {
                board[i][j] = <Cell cell={{row: i, col: j, value: 0, isFlag: false, isBomb: Math.random() < BOMB_PERCENTAGE, isShown: false}} clickCell={clickCell}/>;
            }
        }
        setBoard([...board]);
    }

    const reset = () => {
        setBoard([]);
        setFlag(false);
        setWin("InProgess");
        initBoard();
    }

    useEffect(() => {
        initBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(checkWin()) setWin("Win");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [board])

    return(
        <div className="d-flex mb-5">
            <div>
                <h1 className="fs-3 mb-5">Minesweeper game!</h1>
                {win === "Win" ? <h1 className="fs-3 mb-3">You Won!</h1> : win === "Lose" ? <h1 className="fs-3 ">You Lose!</h1> : null}
                <div className="container game-board" style={{pointerEvents: (win === "Lose" || win === "Win") ? "none" : "all"}}>
                    {React.Children.toArray(board.map((arr, i) => {
                        return <div className="row">{React.Children.toArray(arr.map((_, j) => board[i][j]))}</div>;
                    }))}
                </div>
                <div className="mt-3">
                    <button type="button" className="btn btn-danger py-2" onClick={() => reset()}>Reset board</button>
                    <button type="button" className="btn btn-info ms-5 py-2 px-4" onClick={() => setCellClickFunction()}>🚩</button>
                </div>
            </div>
        </div>
    );
}
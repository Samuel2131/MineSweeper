
import React, { useEffect, useState } from "react";
import { Cell, CellProps } from "./cell";

type gridSettings = {
    ROW: number,
    COL: number,
    BOMB_PERCENTAGE: number //To set bomb quantity;
} 

export const Minessweeper = ({ROW: R, COL: C, BOMB_PERCENTAGE}: gridSettings) => {
    const [ROW, setROW] = useState<number>(R);
    const [COL, setCOL] = useState<number>(C);
    const [board, setBoard] = useState<JSX.Element[][]>(Array.from({length: ROW}, () => Array.from({length: COL})));
    const [flag, setFlag] = useState<boolean>(false);
    const [win, setWin] = useState<"Win" | "Lose" | "InProgess">("InProgess");

    //To count adjacent bombs to cell
    const countBomb = ({row, col}: CellProps): number => {
        return ([...board].splice(row-1===-1 ? 0 : row-1, row-1 === -1 ? 2 : 3).map((arr) => [...arr].splice(col-1 === -1 ? 0 : col-1, col-1 === -1 ? 2 : 3)).reduce((count, arr, i) => {
            return count+=arr.reduce((count, val, j) => {
                if(val.props.cell.isBomb) count++;
                return count
            }, 0);
        }, 0));  
        /*
        let count = 0;
        for(let i=row-1;i<=row+1;i++){
            for(let j=col-1;j<=col+1;j++){
                try{
                    if(!(i === row && j === col) && board![i][j].props.cell.isBomb) count++;
                }catch(e){};
            }
        }
        return count;
        */   
    }

    const setFlagInBoard = (cell : CellProps) => {
        if(cell.isShown) return;
        cell.isFlag = !cell.isFlag;
        board[cell.row][cell.col] = <Cell cell={cell} clickCell={setCellClickFunction}/>;
        setBoard([...board]);
    }

    //To set click function for only cell(for add flag or show cell);
    const setCellClickFunction = () => {
        for(let i=0;i<ROW;i++){
            for(let j=0;j<COL;j++) board[i][j] = <Cell cell={board[i][j].props.cell} clickCell={!flag ? setFlagInBoard : clickCell}/>
        }
        setFlag(!flag);
        setBoard([...board]);
    }

    const checkWin = () => board.every((arr) => arr.every((val) => (val.props.cell.isShown) || (!val.props.cell.isShown && val.props.cell.isBomb)));

    const clickCell = (cell: CellProps) => {
        if(cell.isFlag) return;
        if(!cell.isShown){
            cell.isShown = true
            cell.value = countBomb(cell);
            if(cell.value === 0 && !cell.isBomb){
                for(let i=cell.row-1;i<=cell.row+1;i++){
                    for(let j=cell.col-1;j<=cell.col+1;j++){
                        if(((i>=0 && i<ROW) && (j>=0 && j<COL)) && !(i === cell.row && j === cell.col)) clickCell(board[i][j].props.cell);
                    }
                }
            }
            board[cell.row][cell.col] = <Cell cell={cell} clickCell={clickCell}/>;
            setBoard([...board]);
            if(cell.isBomb) {
                board[cell.row][cell.col] = <Cell cell={cell} clickCell={clickCell} background="red"/>;
                setWin("Lose"); 
                showAllBomb();
            }
        }
    }

    //To show all bomb position after win or lose;
    const showAllBomb = () => {
        for(let i=0;i<ROW;i++){
            for(let j=0;j<COL;j++){
                if(!board[i][j].props.cell.isShown && ((board[i][j].props.cell.isBomb) || (board[i][j].props.cell.isBomb && board[i][j].props.cell.isFlag))) {
                    board[i][j].props.cell.isShown = true;
                    board[i][j].props.cell.value = countBomb(board[i][j].props.cell);
                    board[i][j].props.cell.isFlag = false;
                    board[i][j] = <Cell cell={board[i][j].props.cell} clickCell={clickCell}/>;
                }
            }
        }
        setBoard([...board]);
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
        setBoard(Array.from({length: ROW}, () => Array.from({length: COL})));
        setFlag(false);
        setWin("InProgess");
        initBoard();
    }

    const expandsBoard = () => {
        setROW(ROW === 20 ? 8 : ROW+4);
        setCOL(COL === 20 ? 8 : COL+4);
        setFlag(false);
        setWin("InProgess");
    }

    useEffect(() => {
        initBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => setBoard([]), [ROW, COL]);

    useEffect(() => {
        if(board.length === 0) {
            for(let i=0;i<ROW;i++) {
                let arr = []
                for(let j=0;j<COL;j++) arr.push(<Cell cell={{row: i, col: j, value: 0, isFlag: false, isBomb: Math.random() < BOMB_PERCENTAGE, isShown: false}} clickCell={clickCell}/>);
                board.push(arr);
            }
            setBoard([...board]);
        }
        else if(checkWin() && win === "InProgess") {
            setWin("Win");
            showAllBomb();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [board])

    return(
        <div className="d-flex mb-5">
            <div>
                <h1 className="fs-2 mb-3 mt-3">Minesweeper game!</h1>
                {win === "Win" ? <h1 className="fs-2">You Won!</h1> : win === "Lose" ? <h1 className="fs-2">You Lose!</h1> : null}
                {<span onClick={() => reset()} className="emojiStyle">{win === "Win" ? '😆' : win === "Lose" ? '😣' : '🙂'}</span>}
                <div className="container game-board mt-4" style={{pointerEvents: (win === "Lose" || win === "Win") ? "none" : "all"}}>
                    {board.length !== 0 && React.Children.toArray(board.map((arr, i) => {
                        return <div className="row">{React.Children.toArray(arr.map((_, j) => board[i][j]))}</div>;
                    }))}
                </div>
                <div className="mt-3">
                <button type="button" className="btn btn-info py-2 px-4 btnAdd fw-bold" onClick={() => expandsBoard()}>+</button>
                    <button type="button" className="btn btn-info py-2 px-4 ms-4" onClick={() => setCellClickFunction()}>{flag ? <span className="icon1">1</span> : '🚩'}</button>
                </div>
            </div>
        </div>
    );
}
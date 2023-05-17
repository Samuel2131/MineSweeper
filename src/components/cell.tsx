
export type CellProps = {
    row: number, 
    col: number,
    value: number;
    isFlag: boolean;
    isBomb: boolean;
    isShown: boolean;
}

type Props = {
    cell: CellProps,
    clickCell: (cell: CellProps) => void;
}

export const Cell = ({cell, clickCell}: Props) => {
    const {value, isBomb, isFlag, isShown} = cell;
    const shadow = isShown ? "none" : "inset 2px 2px 2px 2px #dedede";
    return (
        <div className="col box" onClick={() => clickCell(cell)} style={{width: 40, height:30, boxShadow: shadow}}>{isFlag ? '🚩' : isShown ? (isBomb ?  '💣' : value) : null}</div>
    );
}
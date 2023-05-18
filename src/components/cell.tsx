
export type CellProps = {
    row: number, 
    col: number,
    value: number;
    isFlag: boolean;
    isBomb: boolean;
    isShown: boolean;
}

type Props = {
    cell: CellProps;
    background?: string;
    clickCell: (cell: CellProps) => void;
}

const numberColors: string[] = ["#0020C2", "green", "yellow", "#00008B", "#A0522D", "#00FFFF", "black", "red"];

export const Cell = ({cell, clickCell, background}: Props) => {
    const {value, isBomb, isFlag, isShown} = cell;
    const shadow = isShown ? "none" : "inset 2px 2px 2px 2px #dedede";
    return (
        <div className="col box" onClick={() => clickCell(cell)} style={{width: 45, height:35, boxShadow: shadow, backgroundColor: background || "gray"}}>
            {isFlag ? '🚩' : isShown ? (isBomb ?  '💣' : value ? <span style={{color: numberColors[value-1]}}>{value}</span> : null) : null}
        </div>
    );
}
import React, { Dispatch } from 'react';
import { SIZE, TILE_SIZE } from "./consts";
import { ITile, Board } from "./ITile";
import Tile from "./Tile";
import { connect } from 'react-redux';
import { Actions } from './redux/actions';
import { IGame } from './redux/game';
import { GameStates } from './GameStates';
import winImage from './win.png';

interface IProps {
    board: Board;
    state: GameStates;
    seconds: number;
    go: Function;
    refresh: Function;
}

const Game: React.FC<IProps> = ({ board, state, seconds, refresh, go }) => {

    console.log("Game board", board);
    const tiles = board.flat().map(tile => {
        const { row, col } = tile;
        return <Tile
            key={row + "_" + col + "_F" + tile.isFlipped + "_FL" + tile.hasFlag}
            tile={tile}
        />;
    });
    console.log("tiles", tiles);
    const width = TILE_SIZE * SIZE;
    const styleGame = {
        width: width,
        position: "relative",
        margin: "0 auto"
    } as any;

    const styleControls = {
        display: "flex",
        justifyContent: "space-between",
        height: "3em"
    };

    let status = <div>⏳{seconds} s</div>
    if (state === GameStates.OVER) {
        status = <div>😭</div>
    } else if (state === GameStates.VICTORY) {
        status = <div>😎</div>
    } else if (state === GameStates.TIMEOUT) {
        status = <div>😭</div>
    }

    const styleButton = {
        width: "4em",
        height: "2em",
        borderRadius: 2,
        cursor: "pointer"
    };

    const styleTitle = { fontFamily: 'Creepster', color: '#e46', letterSpacing: 3, textShadow: "1px 2px black, -1px -1px black" } as any;

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
                <h1 style={styleTitle}>Minesweeper the game!</h1>
                <div style={styleControls}>
                    <button style={styleButton} onClick={go as any} disabled={state !== GameStates.READY}>Go</button>
                    {status}
                    <button style={styleButton} onClick={refresh as any} disabled={state === GameStates.READY}>Reset</button>
                </div>
                <div className="game" style={styleGame}>
                    {
                        state === GameStates.VICTORY ?
                        <img src={winImage} style={{ width: "100%" }}/>
                        : <div>{tiles}</div>
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state: IGame) => {
    return {
        board: state.board,
        state: state.state,
        seconds: state.seconds
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    refresh: () => dispatch({ type: Actions.REFRESH }),
    go: () => dispatch({ type: Actions.PLAY })
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
import React from 'react';
import { TILE_SIZE } from './consts';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import logo from './mine.png';
import { Actions } from './redux/actions';
import { ITile } from './ITile';
import { GameStates } from './GameStates';
import { IGame } from './redux/game';

interface Props {
    tile: ITile;
    gameState: GameStates;
    flip: Function;
    toggleFlag: Function;
}

const Tile: React.FC<Props> = ({ tile, gameState, flip, toggleFlag }) => {
    const styleParent = {
        position: "absolute",
        userSelect: "none",
        width: TILE_SIZE,
        height: TILE_SIZE,
        top: tile.row * TILE_SIZE,
        left: tile.col * TILE_SIZE,
        textAlign: "center"
    } as any;

    let style = {
        width: TILE_SIZE - 1 - 14,
        height: TILE_SIZE - 1 - 12,
        backgroundColor: "#ccc",
        borderTop: "4px solid #eee",
        borderLeft: "10px solid #666",
        borderBottom: "8px solid #333",
        borderRight: "4px solid #c0c0c0",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    } as any;

    if (gameState === GameStates.READY) {
        const styleOverride = {
            backgroundColor: "#ccc",
            borderTop: "4px solid #eee",
            borderLeft: "10px solid #888",
            borderBottom: "8px solid #555",
            borderRight: "4px solid #c0c0c0"
        } as any;
        style = { ...style, ...styleOverride };
        delete style.cursor;
    }

    if (tile.isFlipped) {
        style = {
            ...style,
            width: TILE_SIZE - 1,
            height: TILE_SIZE - 1,
            backgroundColor: "#ddd",
            cursor: "normal",
            borderTop: "none",
            borderLeft: "none",
            borderBottom: "none",
            borderRight: "none",
        }
    }

    if (gameState === GameStates.OVER && tile.hasMine) {
        style.fontSize = "1.7em";
    }

    let content = null;
    if (tile.isFlipped) {
        content = tile.neighbourMineCount; 
        if (content === 0) {
            content = null;
        }
    } else if (tile.hasFlag) {
        content = "🌵"; // "🚩🌵"
    }
    if (gameState === GameStates.OVER && tile.hasMine) {
        content = "💥"; //<img src={logo} style={{ width: style.width, height: style.height }} />;
    }

    return (
        <div style={styleParent}>
            <div
                style={style}
                onClick={() => {
                    if (gameState === GameStates.RUNNING) {
                        flip(tile);
                    }
                }}
                onContextMenu={(e) => {
                    if (gameState === GameStates.RUNNING && !tile.isFlipped) {
                        toggleFlag(tile);
                    }
                    e.preventDefault();
                }}
            >
                <div>{content}</div>
            </div>
        </div>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    flip: (tile: ITile) => {
        if (tile.hasMine) {
            dispatch({ type: Actions.EXPLODE, tile });
        } else {
            dispatch({ type: Actions.FLIP, tile });
        }
    },
    toggleFlag: (tile: ITile) => {
        dispatch({ type: Actions.TOGGLE_FLAG, tile });
    }
});
const mapStateToProps = (state: IGame) => ({
    gameState: state.state
});

export default connect(mapStateToProps, mapDispatchToProps as any)(Tile) as any;
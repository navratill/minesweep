import React from 'react';
import { TILE_SIZE, STYLE_EMBOSS } from './consts';
import { Actions } from './redux/actions';
import { ITile } from './ITile';
import { GameStates } from './GameStates';
import { Dispatch } from 'redux';
import { IGame } from './redux/game';
import { connect } from 'react-redux';

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
        width: TILE_SIZE - 7,
        height: TILE_SIZE - 6,
        ...STYLE_EMBOSS,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    } as any;

    if (gameState === GameStates.READY) {
        style = {
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: TILE_SIZE -2,
            height: TILE_SIZE -2,
            border: "1px solid grey"
        };
    }

    if (tile.isFlipped) {
        style = {
            ...style,
            width: TILE_SIZE -2,
            height: TILE_SIZE -2,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            border: "1px solid white",
            cursor: "normal",
            borderTop: "none",
            borderLeft: "none",
            borderBottom: "none",
            borderRight: "none",
        }
    }

    if (gameState !== GameStates.RUNNING) {
        delete style.cursor;
    }

    let content = null;
    if (tile.isFlipped) {
        content = tile.neighbourMineCount; 
        if (content === 0) {
            content = null;
        }
    } else if (tile.hasFlag) {
        content = "🌴";
    } else if (gameState === GameStates.READY) {
        content = "❤️";   
    }

    if (gameState === GameStates.OVER && tile.hasMine) {
        content = "🐙"; //<img src={logo} style={{ width: style.width, height: style.height }} />;
    }

    const triggerFlip = (e: any) => {
        if (gameState === GameStates.RUNNING && !tile.isFlipped) {
            toggleFlag(tile);
        }
        e.preventDefault();
    }

    let styleContent = {};
    if (gameState === GameStates.READY) {
        styleContent = {
            animation: "rotate 1000ms linear infinite"
        };
    }
    
    return (
        <div style={styleParent}>
            <div
                style={style}
                onClick={() => {
                    if (gameState === GameStates.RUNNING && !tile.hasFlag) {
                        flip(tile);
                    }
                }}
                onContextMenu={triggerFlip}
            >
                <div style={styleContent}>{content}</div>
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
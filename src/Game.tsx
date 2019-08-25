import React, { Dispatch } from 'react';
import { SIZE, TILE_SIZE } from "./consts";
import Tile from "./Tile";
import { connect } from 'react-redux';
import { Actions } from './redux/actions';
import { IGame } from './redux/game';
import { GameStates } from './GameStates';
import winImage1 from './win1.png';
import winImage2 from './win2.png';
import winImage3 from './win3.png';
import winImage4 from './win4.png';
import winImage6 from './win6.png';
import winImage7 from './win7.png';
import winImage8 from './win8.png';
import winImage10 from './win10.png';
import { ITile } from './ITile';

interface IProps {
    game: IGame;
    go: Function;
    refresh: Function;
}

function randomShuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
const images = [ winImage1, winImage2, winImage3, winImage4, winImage6, winImage7, winImage8 ];
randomShuffle(images);
images.push(winImage10);

const Game: React.FC<IProps> = ({ game, refresh, go }) => {

    console.log("Game board", game.board);
    const tiles = game.board.flat().map((tile: ITile) => {
        const { row, col } = tile;
        return <Tile
            key={row + "_" + col + "_F" + tile.isFlipped + "_FL" + tile.hasFlag}
            tile={tile}
        />;
    });
    console.log("tiles", tiles);
    const width = TILE_SIZE * SIZE;
    let styleGame = {
        border: "1px solid grey",
        width: width,
        height: width,
        position: "relative",
        margin: "0 auto",
        backgroundImage: `url(${images[game.round-1]})`,
        backgroundSize: "cover"
    } as any;

    const styleControls = {
        display: "flex",
        justifyContent: "space-between",
        height: "3em"
    };

    let status = <div>⏳{game.seconds} s</div>
    if (game.state === GameStates.OVER) {
        status = <div className="swing-in-bottom-fwd">☠️</div>
    } else if (game.state === GameStates.VICTORY) {
        status = <div className="swing-in-bottom-fwd">🏆😎🏆</div>
    } else if (game.state === GameStates.TIMEOUT) {
        status = <div className="swing-in-bottom-fwd">😭</div>
    }

    const styleButton = {
        width: "4em",
        height: "2em",
        borderRadius: 2,
        cursor: "pointer"
    };

    const styleTitle = {
        fontFamily: 'Creepster',
        color: '#e46',
        letterSpacing: 3,
        textAlign: "center",
        textShadow: "1px 2px black, -1px -1px black"
    } as any;

    let content: any = <div>{tiles}</div>;
    if (game.state === GameStates.VICTORY) {
        content = null;
    } else if (game.state === GameStates.ALL_LEVELS_COMPLETE) {
        styleGame.backgroundImage = `url(${winImage10})`;

        const styleComplete = {
            textAlign: "center",
            textShadow: "0px 1px black, 0px -1px black, 0px 0px 3px black",
            color: "white",
            fontWeight: "bold",
            animation: "blinker 100ms linear infinite"
        } as any;

        content = <p style={styleComplete}>All levels complete!</p>

        styleGame = {
            ...styleGame,
            border: null,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }
    } else if (game.state === GameStates.OVER) {
        // styleGame.backgroundImage = null;
    }

    const sytleContainer = {
        border: "1px solid grey",
        marginTop: "2em",
        padding: "2em",
        paddingTop: 0
    };

    let resetText = game.state === GameStates.VICTORY ? "Next" : "Reset";
    if (game.state === GameStates.ALL_LEVELS_COMPLETE) {
        resetText = "Again!";
    }

    let deaths = null;
    if (game.deaths > 0) {
        deaths = <div className="swing-in-bottom-fwd">{game.deaths}x☠️</div>;
    }

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={sytleContainer}>
                <h1 style={styleTitle}>Beach sweeper!</h1>
                <div style={styleControls}>
                    <div style={{ width: "3em"}}>{deaths}</div>
                    {status}
                    {
                        game.state === GameStates.READY
                        ? <button style={styleButton} onClick={go as any}>Go</button>
                        : <button style={styleButton} onClick={refresh as any}>
                            { resetText }
                        </button>
                    }
                </div>
                <div className="game" style={styleGame}>
                    {
                        content
                    }
                </div>
                <audio loop autoPlay controls style={{ transform: "scale(0.5, 0.3)", margin: "0 auto", marginTop: 20 }}>
                    <source src="music.mp3" type="audio/mpeg"/>
                </audio>
            </div>
        </div>
    );
}

const mapStateToProps = (state: IGame) => ({game: state});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    refresh: () => dispatch({ type: Actions.REFRESH }),
    go: () => dispatch({ type: Actions.PLAY })
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
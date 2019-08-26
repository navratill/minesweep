import React from 'react';
import { GameStates } from './GameStates';
import { IGame } from './redux/game';
import { connect } from 'react-redux';
import { SIZE, TILE_SIZE } from './consts';
import winImage1 from './win1.png';
import winImage2 from './win2.png';
import winImage3 from './win3.png';
import winImage4 from './win4.png';
import winImage6 from './win6.png';
import winImage7 from './win7.png';
import winImage8 from './win8.png';
import winImage10 from './win10.png';
import Tile from './Tile';
import { ITile } from './ITile';

function randomShuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
const images = [winImage1, winImage2, winImage3, winImage4, winImage6, winImage7, winImage8];
randomShuffle(images);
images.push(winImage10);

interface Props {
    game: IGame;
}

const GameBoard: React.FC<Props> = ({ game }) => {

    const width = TILE_SIZE * SIZE;
    let styleGame = {
        border: "2px solid crimson",
        width: width,
        height: width,
        position: "relative",
        margin: "0 auto",
        backgroundImage: `url(${images[game.round - 1]})`,
        backgroundSize: "cover"
    } as any;

    const tiles = game.board.flat().map((tile: ITile) => {
        const { row, col } = tile;
        return <Tile
            key={row + "_" + col + "_F" + tile.isFlipped + "_FL" + tile.hasFlag}
            tile={tile}
        />;
    });

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
    }
  
    return (
        <div className="game" style={styleGame}>
            {content}
        </div>
    );
}

const mapStateToProps = (state: IGame) => ({
    game: state
});

export default connect(mapStateToProps, null)(GameBoard) as any;
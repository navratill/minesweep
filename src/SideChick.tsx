import React from 'react';
import { MAX_ROUNDS } from './consts';
import { GameStates } from './GameStates';
import { IGame } from './redux/game';
import { connect } from 'react-redux';

interface Props {
    game: IGame;
}

const SideChick: React.FC<Props> = ({ game }) => {
    const styleBubble = {
        border: "solid black",
        borderWidth: "1px 1px 2px 1px",
        borderRadius: 16,
        padding: "2px 8px 6px 8px",
        position: "relative",
        top: 19
    } as any;

    let girlSays = "You can do it, baby! 🤗";
    if (game.round > MAX_ROUNDS / 2) {
        girlSays = "You are getting closer and closer! 💃🤗";
    }
    if (game.state === GameStates.TIMEOUT) {
        girlSays = "Too slow? 🤭😅";
    } else if (game.state === GameStates.OVER) {
        girlSays = "Oops. 😳";
    } else if (game.state === GameStates.VICTORY) {
        girlSays = "Finally! 😍❤️❤️";
    } else if (game.state === GameStates.READY) {
        girlSays = "Are you ready!? 😋";
    } else if (game.state === GameStates.ALL_LEVELS_COMPLETE) {
        girlSays = "You won! 😍❤️ You're my hero!! 😘💋😉";
    }

    return (
        <div style={{ position: "fixed", left: "30%", top: 200, height: 300, pointerEvents: "none"}}>
            <img src="silhuette.png" />
            <div>
                <svg style={{ width: 20, height: 20, position: "relative", left: 50, zIndex: 10}}>
                    <polygon points="20,0 0,20 10,20" style={{fill: "white"}} />
                    <line x1="20" y1="0" x2="0" y2="20" style={{ stroke: "black", strokeWidth: 1}} />
                    <line x1="20" y1="0" x2="10" y2="20" style={{ stroke: "black", strokeWidth: 1}} />
                </svg>
                <span style={styleBubble}>{girlSays}</span>
            </div>
        </div>
    );
}

const mapStateToProps = (state: IGame) => ({
    game: state
});

export default connect(mapStateToProps, null)(SideChick) as any;
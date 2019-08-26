import React, { Dispatch } from 'react';
import { MAX_ROUNDS } from "./consts";
import { connect } from 'react-redux';
import { Actions } from './redux/actions';
import { IGame } from './redux/game';
import SideChick from './SideChick';
import TopPanel from './TopPanel';
import GameBoard from './GameBoard';

interface IProps {
    game: IGame;
    win: Function;
}

const Game: React.FC<IProps> = ({ game, win }) => {
    const sytleContainer = {
        border: "1px solid grey",
        marginTop: "2em",
        padding: "2em",
        paddingTop: 0
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={sytleContainer}>
                <TopPanel/>
                <GameBoard/>
                <audio loop autoPlay controls style={{ transform: "scale(0.5, 0.3)", margin: "0 auto", marginTop: 20 }}>
                    <source src="music.mp3" type="audio/mpeg" />
                </audio>
                <div>{/* 📐🎲🏇🏿 */}
                    <span style={{ cursor: "pointer" }} onClick={win as any}>☄️</span>
                    {game.round}/{MAX_ROUNDS}
                </div>
            </div>
            <SideChick />
        </div>
    );
}

const mapStateToProps = (state: IGame) => ({ game: state });

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    win: () => {
        dispatch({ type: Actions.CHEAT_WIN });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
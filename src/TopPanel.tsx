import React from 'react';
import { GameStates } from './GameStates';
import { IGame } from './redux/game';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from './redux/actions';

interface Props {
    game: IGame;
    go: Function;
    refresh: Function;
}

const TopPanel: React.FC<Props> = ({ game, go, refresh }) => {
    
    const styleButton = {
        width: "4em",
        height: "2em",
        borderRadius: 2,
        cursor: "pointer"
    } as any;

    const styleTitle = {
        fontFamily: 'Creepster',
        color: '#e46',
        letterSpacing: 3,
        textAlign: "center",
        textShadow: "1px 2px black, -1px -1px black"
    } as any;

    const styleControls = {
        display: "flex",
        justifyContent: "space-between",
        height: "3em"
    } as any;

    let deaths = null;
    if (game.deaths > 0) {
        deaths = <div className="swing-in-bottom-fwd">{game.deaths}x☠️</div>;
    }

    let resetText = game.state === GameStates.VICTORY ? "Next" : "Reset";
    if (game.state === GameStates.ALL_LEVELS_COMPLETE) {
        resetText = "Again!";
    }

    let status = <div>⏳{game.seconds} s</div>
    if (game.state === GameStates.OVER) {
        status = <div className="swing-in-bottom-fwd">☠️</div>
    } else if (game.state === GameStates.VICTORY) {
        status = <div className="swing-in-bottom-fwd">🏆😎🏆</div>
    } else if (game.state === GameStates.TIMEOUT) {
        status = <div className="swing-in-bottom-fwd">😭</div>
    }

    return (
        <>
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
        </>
    );
}

const mapStateToProps = (state: IGame) => ({
    game: state
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    refresh: () => dispatch({ type: Actions.REFRESH }),
    go: () => dispatch({ type: Actions.PLAY })
});

export default connect(mapStateToProps, mapDispatchToProps as any)(TopPanel) as any;
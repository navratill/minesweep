import React from 'react';
import './App.css';
import { MAX_ROUNDS } from './consts';
import { Provider } from 'react-redux';
import { Store, createStore } from 'redux';
import Game from './Game';
import { Actions } from './redux/actions';
import { GameStates } from './GameStates';
import { IGame, isVictorious, avalancheFlip, createNewGame } from './redux/game';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: any;
    }
}

const reducer = (state: IGame, action: any) => {
    switch (action.type) {

        case Actions.PLAY:
            return { ...state, state: GameStates.RUNNING };

        case Actions.REFRESH:
            if (state.state === GameStates.ALL_LEVELS_COMPLETE) {
                return createNewGame();
            }

            let result = {
                ...createNewGame(),
                round: state.round,
                state: GameStates.RUNNING,
                deaths: state.deaths
            };
            if (result.round === MAX_ROUNDS) {
                result.state = GameStates.ALL_LEVELS_COMPLETE;
                return result;
            }
            if (state.state === GameStates.VICTORY) {
                result.round++;
            }
            return result;

        case Actions.EXPLODE:
            return { ...state, state: GameStates.OVER, deaths: state.deaths + 1 };

        case Actions.FLIP:
            const tile = state.board[action.tile.row][action.tile.col];
            avalancheFlip(tile, state.board);
            state.board = [...state.board];
            if (isVictorious(state.board)) {
                return { ...state, state: GameStates.VICTORY };
            }
            return { ...state };

        case Actions.TOGGLE_FLAG:
            action.tile.hasFlag = !action.tile.hasFlag;
            state.board = [...state.board];
            return { ...state };

        case Actions.CHEAT_WIN:
            state.state = GameStates.VICTORY;
            return { ...state };

        case Actions.TIMEOUT:
            state.state = GameStates.TIMEOUT;
            return { ...state};
    }
    return state;
};

const store: Store<IGame> = createStore(
    reducer as any,
    createNewGame(),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Game />
        </Provider>
    );
}

export default App;
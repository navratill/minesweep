import React from 'react';
import './App.css';
import { SIZE } from './consts';
import { Provider } from 'react-redux';
import { Store, createStore } from 'redux';
import { combineReducers } from 'redux';
import Game from './Game';
import { Board, ITile } from './ITile';
import { Actions } from './redux/actions';
import { GameStates } from './GameStates';
import { IGame, createBoard, isVictorious, avalancheFlip } from './redux/game';

function startTimer() {
  return setInterval(() => {
    store.dispatch({ type: Actions.ONE_SECOND_TICK });
  }, 500);
}
let timer: any;

const MAX_SECONDS = 69;

function createNewGame(): IGame {
  return {
    state: GameStates.READY,
    seconds: MAX_SECONDS,
    board: createBoard(SIZE)
  };
};

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

const reducer = (state: IGame, action: any) => {
  console.log("action", action);

  switch (action.type) {
    case Actions.PLAY:
        timer = startTimer();
        return { ...state, state: GameStates.RUNNING };
    case Actions.ONE_SECOND_TICK:
      if (state.seconds === 1) {
        clearInterval(timer);
        return { ...state, seconds: 0, state: GameStates.TIMEOUT };
      } else {
        return { ...state, seconds: state.seconds-1 };
      }
    case Actions.REFRESH:
      clearInterval(timer);
      return {
        ...state,
        ...createNewGame()
      };
    case Actions.EXPLODE:
      clearInterval(timer);
      return { ...state, state: GameStates.OVER };
    case Actions.FLIP:
      const tile = state.board[action.tile.row][action.tile.col];
      avalancheFlip(tile, state.board);
      state.board = [...state.board];
      if (isVictorious(state.board)) {
        clearInterval(timer);
        return { ...state, state: GameStates.VICTORY };
      }
      return { ...state };
    case Actions.TOGGLE_FLAG:
      action.tile.hasFlag = !action.tile.hasFlag;
      state.board = [...state.board];
      return { ...state };
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

import React, { Component } from 'react';
import { IGame } from './redux/game';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from './redux/actions';
import { MAX_SECONDS } from './consts';
import { GameStates } from './GameStates';

interface Props {
    state: GameStates;
    timeout: Function;
}

class Timer extends Component<Props, { seconds: number }> {
    private timerHandle: any;
    state = {
        seconds: MAX_SECONDS
    };

    componentDidMount() {
        this.startCountdown();
    }

    componentDidUpdate() {
        this.startCountdown();
    }

    componentWillUnmount() {
        this.stopCountdown();
    }

    render() {
        return <div>⏳{this.state.seconds} s</div>;
    }

    private startCountdown() {
        if (this.props.state === GameStates.RUNNING && !this.timerHandle) {
            this.timerHandle = setInterval(() => {
                this.setState({ seconds: this.state.seconds-1 });
                if (this.state.seconds === 0) {
                    this.stopCountdown();
                    this.props.timeout();
                }
            }, 1000);
        }
    }

    private stopCountdown() {
        if (this.timerHandle) {
            clearInterval(this.timerHandle);
        }
    }
}

const mapStateToProps = (state: IGame) => ({
    state: state.state
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    timeout: () => dispatch({ type: Actions.TIMEOUT })
});

export default connect(mapStateToProps, mapDispatchToProps as any)(Timer) as any;
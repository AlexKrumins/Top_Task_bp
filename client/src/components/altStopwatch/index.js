
import React, { Component } from "react";
import { Input, FormBtn } from "../Form"
import TimerMachine from "react-timer-machine";

import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";


momentDurationFormatSetup(moment);

export default class Stopwatch extends Component {
  static renderPlayerBtn(toggleFunc, stateProp, label) {
    return (
      <button type="button" onClick={() => toggleFunc(!stateProp)}>
        {stateProp ? label.true : label.false}
      </button>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      newTimer: "",
      timeStart:0,
      paused: false,
      started: false,
    };

    this.changeTimeStart = this.changeTimeStart.bind(this);
    this.toggleStartTimer = this.toggleStartTimer.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    console.log("HandleInputChange Name: " + name)
    console.log("HandleInputChange Value: " + value)
    this.setState({
      [name]: value
    });
  };
  
  changeTimeStart = (newTimer) => {
    this.setState({
      timeStart : parseInt(newTimer * 60000)
    })
    this.toggleStartTimer(true)
    console.log("newTimer = " + newTimer)
    setTimeout(this.toggleStartTimer(false),1000)
  }

  toggleStartTimer(isStarted) {
    this.setState({
      started: isStarted
    });
  }

  toggleTimer(isPaused) {
    this.setState({
      paused: isPaused
    });
  }


  render() {
    const { started, paused, timeStart } = this.state;

    return (
      <section className="timerMachine">
        <h1>Timer</h1>
        <span className="timer">
          <TimerMachine
            timeStart={timeStart}
            started={started}
            paused={paused}
            interval={1000}
            formatTimer={(time, ms) =>
              moment.duration(ms, "milliseconds").format("h:mm:ss")
            }
            onStart={time =>
              console.info(`Timer started: ${JSON.stringify(time)}`)
            }
            onStop={time => {
              console.info(`Timer stopped: ${JSON.stringify(time)}`)
              }
            }
            onTick={time =>
              console.info(`Timer ticked: ${JSON.stringify(time)}`)
            }
            onPause={time =>
              console.info(`Timer paused: ${JSON.stringify(time)}`)
            }
            onResume={time =>
              console.info(`Timer resumed: ${JSON.stringify(time)}`)
            }
            onComplete={time =>
              console.info(`Timer completed: ${JSON.stringify(time)}`)
            }
          />
        </span>
        <div className="player">
          {Stopwatch.renderPlayerBtn(this.toggleStartTimer, started, {
            true: "Stop",
            false: "Start"
          })}
          {Stopwatch.renderPlayerBtn(this.toggleTimer, paused, {
            true: "Resume",
            false: "Pause"
          })}
        </div>
        <Input 
          onChange={this.handleInputChange}
          value={this.state.newTimer}
          name="newTimer"
        >

        </Input>
        <FormBtn
          disabled={!this.state.newTimer}
          onClick={() => this.changeTimeStart(this.state.newTimer)}
        >
          Set Timer
        </FormBtn>
      </section>
    );
  }
}
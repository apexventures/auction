import React, { Component } from 'react';
import Countdown from 'react-countdown-now';

class Timmer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisable: false
        };
    }

    /**
     * Time count-down Method
     */
    renderer = ({ days, hours, minutes, seconds, completed })=> {
        if (!completed) {
            // Render a countdown
            return <span>{days}d {hours}h {minutes}m {seconds}s</span>;  
        } else {
            // Render a completed state
            return <span>Time is up..!</span>
        }
    }

    /**
     * when the time of product is completed the bid button will disabled..
     */
    onCompleteHandle = ()=> {
        
        this.setState({
            isDisable: true
        }, ()=>{
            this.props.forDisableButton(this.state.isDisable);
        } );
        
    }

    
    render() {
        const bidEndTime = new Date(this.props.value);
        const bidEndTimeInSec = bidEndTime.getTime();
        return (
            <Countdown
              date={bidEndTimeInSec}
              renderer={this.renderer}
              onComplete={this.onCompleteHandle}
            />
        )
    }
}

export default Timmer;
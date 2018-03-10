import React from 'react';
import $ from 'jquery';
import { merge } from 'lodash';

export default class AntRace extends React.Component {
  constructor(){
    super();
    this.state = {
      ants: {},
      calculating: false,
      calculated: false,
      calculationRenders: 0,
      message: 'Nope'
    };
    this.calculateOdds = this.calculateOdds.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
  const ants = {};
    $.ajax({
      url: "https://antserver-blocjgjbpw.now.sh/graphql?query={ants{name,length}}",
      method: "get"
    }).then(({data}) => {
      data.ants.forEach((ant, i) => {
        ants[i] = ant;
        ants[i].image = `ant${i}`;
        ants[i].likelihoodOfAntWinning = 0;
      });
      this.setState({ants});
    });
  }


  calculateOdds(){
    this.setState({
      calculating: true,
      message: 'Working on it'
    });
    let calculatedCount = 0;
    Object.keys(this.state.ants).forEach((ant, i) => {
    const callback = (likelihoodOfAntWinning) => {
      const newState = merge({}, this.state);
      newState.ants[ant].likelihoodOfAntWinning = likelihoodOfAntWinning;
      calculatedCount++;
      if (calculatedCount === Object.keys(this.state.ants).length) {
        newState.calculated = true;
        newState.message = "Yup.";
      }
      this.setState(newState);
    };
    this.generateAntWinLikelihoodCalculator()(callback);
    });
  }

  generateAntWinLikelihoodCalculator() {
    var delay = 7000 + Math.random() * 7000;
    var likelihoodOfAntWinning = Math.random();
    return function(callback) {
      setTimeout(function() {
        callback(likelihoodOfAntWinning);
      }, delay);
    };
  }


  reset(){
    const newState = merge({}, this.state);
    const ants = newState.ants;
    Object.keys(ants).map((i)=>{ants[i].likelihoodOfAntWinning=0;});
    this.setState({
      calculating: false,
      calculated: false,
      ants: ants
    });
  }



  ants(){
    let ants;

    if (this.state.calculating){
      ants = Object.keys(this.state.ants).map((i)=>{
        let odds = this.state.ants[i].likelihoodOfAntWinning;
        let status = <div className="calculating">Calculating</div>;
        let move;
        if (odds !== 0) {
          status =<div className="antOdds">Chance: {parseFloat(odds).toFixed(5)}</div>;
          move = this.move(odds);
        }
        return (<div key={i}>
          <div className='odds'>{`${Math.round(odds * 100)}%`}</div>
          <ul style={move} className={`racer id${i}`}>
            <li>{this.state.ants[i].name}</li>
            <li>Length: {this.state.ants[i].length}</li>
            {status}
            <div className={this.state.ants[i].image}></div>
          </ul>
        </div>);
      });
    } else {
      ants = Object.keys(this.state.ants).map((i)=>{
        return (<div key={i}>
          <ul className={`racer id${i}`}>
            <li>{this.state.ants[i].name}</li>
            <li>Length: {this.state.ants[i].length}</li>
            <div className={this.state.ants[i].image}></div>
          </ul>
        </div>);
      });
    }
    return ants;
  }

  move(odds){
    let distance = `translateX(${odds * (65 - 0) + 0}vw)`;
    const move = {
      transitionTimingFunction: "ease-in-out",
      transition: "3s",
      transform: distance
    };
    return move;
  }



  render(){
    let ants = this.ants();
    let button = '';

    if (!this.state.calculating) {
      button = <button className="calcButton" onClick={this.calculateOdds}>Calculate Odds</button>;
    } else if (this.state.calculated) {
      button = <button className="reset" onClick={this.reset}>Reset</button>;
    }

    return(
        <div className="main">
          <h1 className="title">Ant Race</h1>
          <div className="racers">
            {ants}
          </div>
          {button}
          <div className="oddsLabel">ODDS</div>
          <div className="message">Calculated? {this.state.message}</div>
        </div>

    );
  }
}

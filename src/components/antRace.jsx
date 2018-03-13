import React from 'react';
import $ from 'jquery';
import { merge } from 'lodash';
import CountUp from 'react-countup';

export default class AntRace extends React.Component {
  constructor(){
    super();
    this.state = {
      ants: {},
      calculating: false,
      calculated: false,
      calculationRenders: 0,
      message: 'Nope.'
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
      message: 'Working on it.'
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
      ants: ants,
      message: 'Nope.'
    });
  }

  mostLikelyWinner(){
    let high = 0;
    let ant;
    let winner = Object.keys(this.state.ants).forEach((i)=>{
      if (this.state.ants[i].likelihoodOfAntWinning > high) {
        high = this.state.ants[i].likelihoodOfAntWinning;
        ant = i;
      }
    });
    return ant;
  }


  ants(){
    let ants;
    let mostLikelyWinner = this.mostLikelyWinner();
    if (this.state.calculating){
      ants = Object.keys(this.state.ants).map((i)=>{

        let odds = this.state.ants[i].likelihoodOfAntWinning;
        let status = <div className="calculating">Calculating</div>;
        let move = {};

        if (odds !== 0) {
          status =<div className="antOdds">Chance: {parseFloat(odds).toFixed(5)}</div>;
          move = this.move(odds, mostLikelyWinner, i);
        }

        return (<div key={i}>
          <CountUp className="odds" start={0} end={Math.round(odds * 100)} suffix="%" />
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

  move(odds, ant, i){
    let opacity = {opacity: .5};
    let distance = `${odds * (65 - 0) + 0}vw`;
    if (i === ant) {
       opacity = {opacity: 1};
    }
    const move = {
      transitionTimingFunction: "ease-in-out",
      transition: "3s",
      paddingLeft: distance,
      opacity: opacity.opacity
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
      <div>
        <div className="main">
          <h1 className="title">Ant Race</h1>
          <div className="racers">
            {ants}
          </div>
          <div className="oddsLabel">ODDS</div>
          <div className="message">Calculated? {this.state.message}</div>
        </div>
        {button}
        <div className="links">
          Brice Powell &nbsp;|&nbsp;
          <a href="http://bricepowell.com">Portfolio</a>&nbsp;|&nbsp;
          <a href="https://github.com/bpowell15">Github</a>&nbsp;|&nbsp;
          <a href="https://linkedin.com/in/bpowell15">LinkedIn</a>&nbsp;|&nbsp;
          <a href="https://angel.co/brice-powell?public_profile=1">Angel List</a>
        </div>
      </div>
    );
  }
}

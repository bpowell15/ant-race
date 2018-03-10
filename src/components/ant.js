let ants = Object.keys(this.state.ants).map((i)=>{
  let odds = this.state.ants[i].likelihoodOfAntWinning;
  let status = <div className="calculating">Calculating</div>;
  let move;
  if (odds !== 0) {
    status =<div className="antOdds">Chance: {parseFloat(odds).toFixed(5)}</div>
    move = this.move(odds);
  }
  return (<div>
    <div className='odds'>{`${Math.round(odds * 100)}%`}</div>
    <ul style={move} className={`racer id${i}`}>
      <li>{this.state.ants[i].name}</li>
      <li>Length: {this.state.ants[i].length}</li>
      {status}
      <div className={this.state.ants[i].image}></div>
    </ul>
  </div>);
});

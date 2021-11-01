let App = document.getElementById('app')

const StarsDisplay = props => (

  <React.Fragment>
    {utils.range(1, props.count).map(starID =>
      <div key={starID}
        className="star" />
    )}
  </React.Fragment>

);

const BtnNumber = props => (
  <button className="number"
    style={{ backgroundColor: colors[props.status] }}
    onClick={() => props.onClick(props.number, props.status)}
  >
    {props.number}
  </button>
)

const PlayAgain = props => (
  <div className="game-done">
    <div className='game-stats' style={{ color: props.gameStatus === 'Lost' ? 'black' : 'green' }}>
      {props.gameStatus === 'Lost' ? 'Game over' : 'Nice Well Played'

      }
    </div>
    <button className='play-again' onClick={props.onClick}>Play Again</button>
  </div>
);

const useGameStat = () => {
  const [stars, setStars] = React.useState(utils.random(1, 9));
  const [availNum, setAvailNums] = React.useState(utils.range(1, 9))
  const [candid, setCandid] = React.useState([])
  const [secLeft, setSec] = React.useState(5)

  React.useEffect(() => {
    if (secLeft > 0 && availNum.length > 0) {
      const timerId = setTimeout(() => {
        setSec(secLeft - 1);
      }, 1000)
      // this is the cleanup because the state continues to change
      //return () => clearTimeout(timerId)
    }
  });

  const setGameState = (newCandid) => {
    if (utils.sum(newCandid) !== stars) {
      setCandid(newCandid);
    } else {
      const newAvail = availNum.filter(
        n => !newCandid.includes(n)
      );
      setStars(utils.randomSumIn(newAvail, 9));
      setAvailNums(newAvail);
      setCandid([]);
    }
  }
  return { stars, availNum, candid, secLeft, setGameState }
}

const Game = (props) => {

  const { stars,
    availNum,
    candid,
    secLeft,
    setGameState,
  } = useGameStat()


  const candidWrong = utils.sum(candid) > stars;

  const gameIsDone = availNum.length === 0;

  const gameIsLost = secLeft === 0;


  const gameStat = gameIsDone ? 'Won' : gameIsLost ? 'Lost' : 'Active';


  const resetGame = () => {
    setStars(utils.random(1, 9));
    setAvailNums(utils.range(1, 9));
    setCandid([]);
    secLeft(10)

  }

  const NumberStatus = (props) => {
    if (!availNum.includes(props)) {
      return 'used';
    }
    if (candid.includes(props)) {
      return candidWrong ? 'wrong' : 'candidate';
    }
    return 'available'

  };


  const onNumClick = (number, currentStatus) => {
    if (currentStatus == 'used' || gameStat !== 'Active') {
      return;
    }

    const newCandid =
      currentStatus === 'available'
        ? candid.concat(number)
        : candid.filter(cn => cn !== number);

        setGameState(newCandid);

  }

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStat !== 'Active' ? (
            <PlayAgain onClick={props.startGame} gameStatus={gameStat} />
          ) : (
            <StarsDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number =>
            <BtnNumber key={number}
              status={NumberStatus(number)}
              number={number}
              onClick={onNumClick} />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secLeft}</div>
    </div>
  );
};

const StarMatch = () => {
  const [gameId, setGame] = React.useState(1)
  return <Game key={gameId} startGame={() => setGame(gameId + 1)} />
}

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

ReactDOM.render(<StarMatch />, App);


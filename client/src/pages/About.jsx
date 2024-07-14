import '../App.css';
import TrialBike from '../components/TrialBike';
import '../minesweeper.css';

export default function About () {
  return (
    <div>
       <h1>How to Play</h1> 

      <div className="separator-line"></div>

<p>description</p>
      
      <div className="separator-line"></div>

{/* game component */}

<div className='grid-wrapper'>
<div className='white-box'>
      <TrialBike />
</div>
</div>
{/* -------------- */}

    </div>
  );
}

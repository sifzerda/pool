import '../App.css';
import Pool from '../components/Pool';
import '../8ballpool.css';

export default function About () {
  return (
    <div>
       <h1>How to Play</h1> 

      <div className="separator-line"></div>

<p>Click and drag cue ball to aim and power shot, release to fire</p>
      
      <div className="separator-line"></div>

{/* game component */}

<div className='grid-wrapper'>
<div className='white-box'>
      <Pool />
</div>
</div>
{/* -------------- */}

    </div>
  );
}
import '../App.css';
import Pool from '../components/Pool';
import '../8ballpool.css';

export default function About () {
  return (
    <div>

<p className='gap'>Click and hold the cue ball, and drag back to power shot. Release to fire.</p>
      
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

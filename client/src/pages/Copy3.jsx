import '../App.css';
import Copy3 from '../components/Copy3';
import '../minesweeper.css';

export default function About () {
  return (
    <div>
       <h1>How to Play</h1> 

      <div className="separator-line"></div>

<p>this is a simplified copy of the Pool game for debugging or backup purposes</p>
      
      <div className="separator-line"></div>

{/* game component */}

<div className='grid-wrapper'>
<div className='white-box'>
      <Copy3 />
</div>
</div>
{/* -------------- */}

    </div>
  );
}
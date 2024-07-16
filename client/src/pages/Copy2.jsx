import '../App.css';
import Copy2 from '../components/Copy2';
import '../8ballpool.css';

export default function About () {
  return (
    <div>
       <h1>How to Play</h1> 

      <div className="separator-line"></div>

<p>This is a very basic pool shot mechanic in basic js without matter.js</p>
      
      <div className="separator-line"></div>

{/* game component */}

<div className='grid-wrapper'>
<div className='white-box'>
      <Copy2 />
</div>
</div>
{/* -------------- */}

    </div>
  );
}
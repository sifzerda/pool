import Auth from '../utils/auth';

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <h1> &lt; Main Menu &gt;</h1>

      {/* Conditional rendering based on success message state */}
      {!Auth.loggedIn() && (
          <p className='color'>You must be logged in to submit your highscore</p>
      )}
      
      <button className="submit-button-m" onClick={onStart}>START GAME</button>
    </div>
  );
};

export default StartScreen;
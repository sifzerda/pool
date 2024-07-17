import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { QUERY_ME } from '../utils/queries';
import { SAVE_POOL_SCORE } from '../utils/mutations';
import '../App.css';

const FinalScore = ({ score, time, onHighScores }) => {
    const [poolPoints, setPoolPoints] = useState(score);
    const [poolTimeTaken, setPoolTimeTaken] = useState(time);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const { data } = useQuery(QUERY_ME);
    const userId = data?.me?._id;
    const username = data?.me?.username || 'Anonymous';

    const [savePoolScore] = useMutation(SAVE_POOL_SCORE);

    // ------------------------------------------------------------//

    //console.log('TIME EQUALS = :', time);

    // Helper FX to convert timer to minutes and seconds
    const formatTime = (time) => {
      // Ensure time is a number
      const totalTime = parseInt(time, 10);
      if (isNaN(totalTime)) {
          return '0:00';
      }
      const minutes = Math.floor(totalTime / 60);
      const seconds = totalTime % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

      // ------------------------------------------------------------//

    const handleSubmit = async () => {

        try {
            const { data } = await savePoolScore({
                variables: {
                    userId,
                    poolPoints,
                    poolTimeTaken,
                },
            });
            console.log('Score saved:', data.savePoolScore);
            // Optionally, you can trigger some UI update or action upon successful save
            setShowSuccessMessage(true); // Show success message
        } catch (error) {
            console.error('Error saving score:', error);
            // Handle error state or display a message to the user
            alert('There was an error saving your score', error);
        }
    };

// ------------------------ rendering ------------------------------------//

    return (
        <div className="grid-container">
            <h1 className='start-2'>Game Over</h1>
            <p className='white-text'>Your final score: <span className='bright'>{score}</span></p>
            <p className='black-text'>Time Taken: <span className='bright'>{formatTime(time)}</span></p>

            {/* Conditional rendering based on success message state */}
            {showSuccessMessage ? (
                <p className="success">Your score has been submitted!</p>
            ) : (
                Auth.loggedIn() ? (
                    <button className="submit-button-m" onClick={handleSubmit}>
                        Submit Score
                    </button>
                ) : (
                    <p className='black-text'>
                        You must <Link to="/login">LOG IN</Link> or <Link to="/signup">SIGNUP</Link> to Submit a Score.
                    </p>
                )
            )}

            <button className="submit-button-m" onClick={onHighScores}>
                High Scores
            </button>

            <button className="submit-button-m" onClick={() => window.location.reload()}>
                Play Again
            </button>
        </div>
    );
};

export default FinalScore;
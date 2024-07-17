import '../App.css'; 
import { useQuery } from '@apollo/client';
import { QUERY_USERS } from '../utils/queries';

const HighScores = () => {
  const { loading, data, error } = useQuery(QUERY_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const users = data.users; // Extracting users from query data

      // ------------------------------------------------------------//

    // Helper FX to convert timer to minutes and seconds
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

      // ------------------------------------------------------------//

  // Aggregate all astScore entries with associated usernames
  let allScores = [];
  users.forEach(user => {
    user.poolScore.forEach(score => {
      allScores.push({
        username: user.username,
        poolPoints: score.poolPoints,
        poolTimeTaken: score.poolTimeTaken,
      });
    });
  });

  // Sort combined scores by astPoints in descending order
  // If points are the same, then sort by astTimeTaken in ascending order
  allScores.sort((a, b) => {
    if (b.poolPoints !== a.poolPoints) {
      return b.poolPoints - a.poolPoints; // Sort by points descending
    }
});

// Limit to top 20 scores
const top20Scores = allScores.slice(0, 20);

return (
  <div className="grid-wrapper">
    <div className="grid-container">
      <h1 className='end'>High Scores</h1>
      <div className="table-container">
      <table className="high-scores-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Score</th>
            <th>Time Taken:</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {top20Scores.map((score, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{score.poolPoints}</td>
              <td>{formatTime(score.poolTimeTaken)}</td>
              <td>{score.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button className="submit-button-m" onClick={() => window.location.reload()}>BACK</button>
    </div>
    
    </div>
  );
};

export default HighScores;
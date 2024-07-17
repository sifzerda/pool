import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import '../App.css';
import '../8ballpool.css';

const Profile = () => {
    const { loading, data, error } = useQuery(QUERY_ME);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const user = data?.me;
    const poolScores = user?.poolScore || [];

          // ------------------------------------------------------------//

    // Helper FX to convert timer to minutes and seconds
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      };
  
        // ------------------------------------------------------------//

    // Sort scores by highest minePoints, and then by least time taken if points are tied
    const sortedScores = [...poolScores].sort((a, b) => {
        if (b.poolPoints !== a.poolPoints) {
            return b.poolPoints - a.poolPoints; // Sort by points descending
        } else {
            return a.poolTimeTaken - b.poolTimeTaken; // Sort by time ascending if points are tied
        }
    });

    // Limit to 10 scores
    const limitedScores = sortedScores.slice(0, 10);

    return (
        <div className="profile-container">
            <div className="jumbo-bg-dark">
                <h1 className='jumbo-bg-dark-text'>{user.username}&apos;s Corner</h1>
            </div>
            <p className='black-text'>Email: {user.email}</p>
            <p className="email-info">Note: Your email cannot be seen by other users</p>
            <h2 className='profile-text'>Your Eight Ball Pool Highscores:</h2>
            
            {limitedScores.length === 0 ? (
                <p className="black-text">No high scores yet!</p>
            ) : (
                <table className="high-scores-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Score</th>
                            <th>Time (in Seconds)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {limitedScores.map((score, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{score.poolPoints}</td>
                                <td>{formatTime(score.poolTimeTaken)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Profile;
// src/components/PersonalResult/PersonalResult.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/config';
import './PersonalResult.scss';

const PersonalResult = ({ userData, totalQuestions, result }) => {
  const [personalStats, setPersonalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersonalStats();
  }, [userData]);

  const fetchPersonalStats = async () => {
    try {
      // Get all scores to calculate rank
      const { data: allScores, error: scoresError } = await supabase
        .from('leaderboard')
        .select('id, score, completed_at')
        .order('score', { ascending: false })
        .order('completed_at', { ascending: true });

      if (scoresError) throw scoresError;

      // Get user's specific entry (most recent)
      const { data: userEntries, error: userError } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('email', userData.email)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (userError) throw userError;

      if (userEntries && userEntries.length > 0) {
        const userEntry = userEntries[0];
        
        // Calculate rank
        const rank = allScores.findIndex(entry => entry.id === userEntry.id) + 1;
        
        // Calculate percentile
        const totalEntries = allScores.length;
        const percentile = Math.round(((totalEntries - rank + 1) / totalEntries) * 100);
        
        // Count better and worse scores
        const betterScores = allScores.filter(entry => entry.score > userEntry.score).length;
        const worseScores = allScores.filter(entry => entry.score < userEntry.score).length;
        const sameScores = allScores.filter(entry => entry.score === userEntry.score).length - 1; // Exclude self

        setPersonalStats({
          userEntry,
          rank,
          totalEntries,
          percentile,
          betterScores,
          worseScores,
          sameScores
        });
      }

      setError(null);
    } catch (error) {
      console.error('Error fetching personal stats:', error);
      setError('Failed to load your personal statistics');
    } finally {
      setLoading(false);
    }
  };

  const getRankSuffix = (rank) => {
    if (rank % 100 >= 11 && rank % 100 <= 13) return 'th';
    switch (rank % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '⭐';
    return '🎯';
  };

  const getPerformanceLevel = (percentile) => {
    if (percentile >= 90) return { level: 'Elite', color: '#28a745', emoji: '🏆' };
    if (percentile >= 75) return { level: 'Excellent', color: '#17a2b8', emoji: '⭐' };
    if (percentile >= 50) return { level: 'Good', color: '#ffc107', emoji: '👍' };
    if (percentile >= 25) return { level: 'Average', color: '#fd7e14', emoji: '📊' };
    return { level: 'Wow', color: '#dc3545', emoji: '💪' };
  };

  if (loading) {
    return (
      <div className="personal-result">
        <div className="loading">Loading your personal statistics...</div>
      </div>
    );
  }

  if (error || !personalStats) {
    return (
      <div className="personal-result">
        <div className="error">{error || 'Could not load your statistics'}</div>
      </div>
    );
  }

  const { userEntry, rank, totalEntries, percentile, betterScores, worseScores, sameScores } = personalStats;
  const performance = getPerformanceLevel(percentile);

  return (
    <div className="personal-result">
      <div className="rank-card">
        <div className="rank-display">
          <span className="rank-emoji">{getRankEmoji(rank)}</span>
          <div className="rank-info">
            <span className="rank-number">{rank}{getRankSuffix(rank)}</span>
            <span className="rank-total">out of {totalEntries}</span>
          </div>
        </div>
        
        <div className="percentile-info">
          <span className="percentile-text">Top {100 - percentile}%</span>
          <div className="performance-badge" style={{ backgroundColor: performance.color }}>
            {performance.emoji} {performance.level}
          </div>
        </div>
      </div>

      <div className="personal-stats">
        <div className="stat-row">
          <div className="stat-item">
            <span className="stat-label">Your Score</span>
            <span className="stat-value highlight">{userEntry.score} pts</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Percentage</span>
            <span className="stat-value">{userEntry.percentage}%</span>
          </div>
        </div>

        <div className="comparison-stats">
          <h4>📈 How You Compare</h4>
          <div className="comparison-grid">
            <div className="comparison-item better">
              <span className="comparison-number">{betterScores}</span>
              <span className="comparison-label">scored higher</span>
            </div>
            <div className="comparison-item same">
              <span className="comparison-number">{sameScores}</span>
              <span className="comparison-label">same score</span>
            </div>
            <div className="comparison-item worse">
              <span className="comparison-number">{worseScores}</span>
              <span className="comparison-label">scored lower</span>
            </div>
          </div>
        </div>

        <div className="completion-info">
          <p className="completion-text">
            Completed on {new Date(userEntry.completed_at).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div className="motivation-message">
          {rank === 1 ? (
            <p className="champion">🎉 Congratulations! You're currently #1 on the leaderboard!</p>
          ) : rank <= 3 ? (
            <p className="podium">🏅 Amazing! You're on the podium!</p>
          ) : rank <= 10 ? (
            <p className="top-ten">⭐ Great job! You're in the top 10!</p>
          ) : percentile >= 75 ? (
            <p className="top-quarter">🚀 Excellent performance! You're in the top 25%!</p>
          ) : (
            <p className="keep-going">💪 Good Sport!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalResult;
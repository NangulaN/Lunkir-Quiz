import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/config';
import './Leaderboard.scss';

const Leaderboard = ({ showTitle = true, maxEntries = 10 }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leaderboard'
        },
        (payload) => {
          console.log('Leaderboard updated:', payload);
          fetchLeaderboard(); // Refetch data when changes occur
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [maxEntries]);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('id, name, score, percentage, completed_at')
        .order('score', { ascending: false })
        .order('completed_at', { ascending: true })
        .limit(maxEntries);

      if (error) {
        throw error;
      }

      setLeaderboardData(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (rank) => {
    switch(rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const formatName = (name) => {
    return name;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="leaderboard">
        {showTitle && <h2>🏆 Leaderboard</h2>}
        <div className="loading">Loading scores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard">
        {showTitle && <h2>🏆 Leaderboard</h2>}
        <div className="error">{error}</div>
        <button onClick={fetchLeaderboard} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="leaderboard">
        {showTitle && <h2>🏆 Leaderboard</h2>}
        <div className="empty">No scores yet. Be the first to complete the quiz!</div>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      {showTitle && <h2>🏆 Leaderboard</h2>}
      
      <div className="leaderboard-list">
        {leaderboardData.map((entry, index) => (
          <div key={entry.id} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
            <div className="rank">
              {getRankEmoji(index + 1)}
            </div>
            
            <div className="player-info">
              <div className="name">{formatName(entry.name)}</div>
              <div className="completion-date">{formatDate(entry.completed_at)}</div>
            </div>
            
            <div className="score-info">
              <div className="score">{entry.score}</div>
              <div className="percentage">{entry.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="leaderboard-footer">
        <button onClick={fetchLeaderboard} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
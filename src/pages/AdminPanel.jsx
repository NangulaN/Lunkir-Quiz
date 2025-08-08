import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import './AdminPanel.scss';

const AdminPanel = () => {
  const [quizActive, setQuizActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  
  const ADMIN_PASSWORD = 'omak0n@kona'; 

  useEffect(() => {
    if (authenticated) {
      fetchQuizStatus();
    }
  }, [authenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPassword('');
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const fetchQuizStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('quiz_active')
        .eq('id', 1)
        .single();

      if (error) throw error;
      setQuizActive(data.quiz_active);
    } catch (error) {
      console.error('Error fetching quiz status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuizStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ 
          quiz_active: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (error) throw error;
      
      setQuizActive(newStatus);
      alert(`Quiz ${newStatus ? 'activated' : 'closed'} successfully!`);
    } catch (error) {
      console.error('Error updating quiz status:', error);
      alert('Failed to update quiz status');
    } finally {
      setUpdating(false);
    }
  };

  const exportResults = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('name, email, score, percentage, completed_at')
        .order('score', { ascending: false });

      if (error) throw error;

      // Convert to CSV
      const csvContent = [
        ['Name', 'Email', 'Score', 'Percentage', 'Completed At'],
        ...data.map(row => [
          row.name, 
          row.email, 
          row.score, 
          row.percentage, 
          new Date(row.completed_at).toLocaleString()
        ])
      ].map(row => row.join(',')).join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export results');
    }
  };

  if (!authenticated) {
    return (
      <div className="admin-panel">
        <div className="admin-login">
          <h2>🔐 Admin Access</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>📊 Quiz Admin Panel</h1>
        <p>Control your quiz and export results</p>
      </header>

      <div className="admin-content">
        <div className="quiz-control-section">
          <h3>🎯 Quiz Control</h3>
          <div className="status-display">
            <span className="status-label">Current Status:</span>
            <span className={`status-badge ${quizActive ? 'active' : 'closed'}`}>
              {quizActive ? '🟢 Active' : '🔴 Closed'}
            </span>
          </div>
          
          <div className="control-buttons">
            <button
              onClick={() => updateQuizStatus(true)}
              disabled={updating || quizActive}
              className="activate-btn"
            >
              {updating ? 'Updating...' : '🚀 Activate Quiz'}
            </button>
            <button
              onClick={() => updateQuizStatus(false)}
              disabled={updating || !quizActive}
              className="close-btn"
            >
              {updating ? 'Updating...' : '🏁 Close Quiz'}
            </button>
          </div>
        </div>

        <div className="export-section">
          <h3>📁 Export Results</h3>
          <p>Download all quiz results as a CSV file</p>
          <button onClick={exportResults} className="export-btn">
            📥 Export All Results
          </button>
        </div>

        <div className="links-section">
          <h3>🔗 Quick Links</h3>
          <div className="quick-links">
            <a href="/" className="link-btn">🏠 Home</a>
            <a href="/quiz" className="link-btn">🧠 Quiz</a>
            <a href="/leaderboard" className="link-btn">🏆 Leaderboard</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
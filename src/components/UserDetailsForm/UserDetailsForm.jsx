import { useState } from 'react';
import { supabase } from '../../supabase/config';
import './UserDetailsForm.scss';

const UserDetailsForm = ({ score, totalQuestions, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        score: score,
        total_questions: totalQuestions,
        percentage: parseFloat(((score / (totalQuestions * 10)) * 100).toFixed(2)),
        completed_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('leaderboard')
        .insert([submissionData])
        .select();

      if (error) {
        throw error;
      }
      
      console.log('Score saved successfully:', data);
      onSubmitSuccess(submissionData);
      
    } catch (error) {
      console.error('Error saving to leaderboard:', error);
      alert('Failed to save your score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const percentage = Math.round((score / (totalQuestions * 5)) * 100);

  return (
    <div className="user-details-form">
      <h3>Quiz Complete! 🎉</h3>
      
      <div className="completion-message">
        <p>🎯 You've finished all {totalQuestions} questions!</p>
        <p>Enter your details below to see your results and get on the leaderboard:</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name *"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Your Email *"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Revealing Results...' : 'Reveal My Results! 🎁'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailsForm;
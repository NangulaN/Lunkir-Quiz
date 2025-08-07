// src/components/UserDetailsForm/UserDetailsForm.jsx
import { useState } from 'react';
import { supabase } from '../../supabase/config';
import './UserDetailsForm.scss';

const UserDetailsForm = ({ score, totalQuestions, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
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
        surname: formData.surname.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        score: score,
        total_questions: totalQuestions,
        percentage: parseFloat(((score / (totalQuestions * 5)) * 100).toFixed(2)),
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
      onSubmitSuccess();
      
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
      <h3>Save Your Score to Leaderboard! 🏆</h3>
      <p className="score-display">
        Your Score: <span className="score">{score}/{totalQuestions * 5}</span>
        <span className="percentage">({percentage}%)</span>
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="First Name *"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="surname"
            placeholder="Last Name *"
            value={formData.surname}
            onChange={handleInputChange}
            className={errors.surname ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.surname && <span className="error-message">{errors.surname}</span>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Saving...' : 'Save to Leaderboard'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailsForm;
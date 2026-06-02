import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Check, X, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useFetch } from '../hooks/useFetch';

export default function Quiz() {
  const navigate = useNavigate();
  const { data: questions, loading, error } = useFetch('/questions.json');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (loading || error || !questions) return;
    
    if (timeLeft > 0 && !isAnswered) {
      const timerId = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !isAnswered) {
      setIsAnswered(true);
    }
  }, [timeLeft, isAnswered, loading, error, questions]);

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 size={48} className="spinner" style={{ animation: 'spin 1s linear infinite', color: 'var(--apple-blue)' }} />
      </div>
    );
  }

  if (error || !questions) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--apple-red)' }}>
        <h2>Erreur: {error || 'Impossible de charger les questions'}</h2>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  const handleSelect = (index) => {
    if (!isAnswered) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null && !isAnswered) {
      setIsAnswered(true);
    } else if (isAnswered) {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(60);
    } else {
      navigate('/resultats');
    }
  };

  const getOptionStatus = (index) => {
    if (!isAnswered) {
      return 'default';
    }
    if (index === question.bonne_réponse) {
      return 'correct';
    }
    if (selectedOption === index && index !== question.bonne_réponse) {
      return 'wrong';
    }
    return 'default';
  };

  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      
      {/* Header with Progress & Timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <div className="progress-container" style={{ marginBottom: 0 }}>
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          color: timeLeft <= 10 ? 'var(--apple-red)' : 'var(--apple-green)',
          fontWeight: 700, fontSize: '1.2rem' 
        }}>
          <Timer size={24} />
          <span>0:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Category Badge */}
        <div style={{ 
          alignSelf: 'flex-start', background: 'var(--apple-purple)', padding: '6px 16px', 
          borderRadius: '16px', fontSize: '0.9rem', fontWeight: 700, color: '#fff', 
          textTransform: 'uppercase', letterSpacing: '1px' 
        }}>
          {question.catégorie}
        </div>

        {/* Question Text */}
        <h2 style={{ fontSize: '1.8rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
          {question.libellé}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
          {question.options.map((opt, idx) => (
            <Button 
              key={idx}
              variant="secondary"
              selected={!isAnswered && selectedOption === idx}
              status={getOptionStatus(idx)}
              onClick={() => handleSelect(idx)}
            >
              <span>{opt}</span>
              {isAnswered && idx === question.bonne_réponse && <Check color="var(--apple-green)" size={24} />}
              {isAnswered && selectedOption === idx && idx !== question.bonne_réponse && <X color="var(--apple-red)" size={24} />}
            </Button>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div style={{ marginTop: '32px' }}>
        <Button 
          variant="primary" 
          disabled={selectedOption === null && !isAnswered}
          onClick={handleSubmit}
          status={isAnswered ? (selectedOption === question.bonne_réponse ? 'correct' : 'wrong') : 'default'}
        >
          {isAnswered ? 'CONTINUER' : 'VÉRIFIER'}
        </Button>
      </div>

    </div>
  );
}

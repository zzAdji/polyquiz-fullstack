import React, { useEffect, useReducer, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Timer, X, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import { useFetch } from '../hooks/useFetch';
import { useUser } from '../context/UserContext';
import { apiFetch } from '../config/api';

const initialState = {
  status: 'idle',
  currentIndex: 0,
  selectedOption: null,
  score: 0,
  timeLeft: 60,
  lastAnswerCorrect: null,
  pointsFxSeed: 0,
};

function quizReducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ':
      return { ...initialState, status: 'playing' };

    case 'SELECT_OPTION':
      if (state.status !== 'playing') return state;
      return { ...state, selectedOption: action.payload };

    case 'ANSWER_QUESTION': {
      if (state.status !== 'playing' || state.selectedOption === null) return state;
      const isCorrect = action.payload.selectedAnswer === action.payload.correctAnswer;

      return {
        ...state,
        status: 'answered',
        score: isCorrect ? state.score + 1000 : state.score,
        lastAnswerCorrect: isCorrect,
        pointsFxSeed: isCorrect ? state.pointsFxSeed + 1 : state.pointsFxSeed,
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1;

      if (nextIndex >= action.payload.total) {
        return { ...state, status: 'finished' };
      }

      return {
        ...state,
        status: 'playing',
        currentIndex: nextIndex,
        selectedOption: null,
        lastAnswerCorrect: null,
      };
    }

    case 'TICK':
      if (state.timeLeft <= 1) return { ...state, timeLeft: 0 };
      return { ...state, timeLeft: state.timeLeft - 1 };

    case 'FINISH_QUIZ':
      return { ...state, status: 'finished' };

    default:
      return state;
  }
}

export default function QuizEngine() {
  const navigate = useNavigate();
  const { updateBestScore } = useUser();
  const { data: questions, loading, error } = useFetch('/api/questions');
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const intervalRef = useRef(null);
  const scoreSubmittedRef = useRef(false);

  const { status, currentIndex, selectedOption, score, timeLeft, lastAnswerCorrect, pointsFxSeed } = state;

  useEffect(() => {
    if (questions?.length && status === 'idle') {
      scoreSubmittedRef.current = false;
      dispatch({ type: 'START_QUIZ' });
    }
  }, [questions, status]);

  useEffect(() => {
    if (status === 'playing' && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }

    if (status !== 'playing' && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  useEffect(() => {
    if (timeLeft !== 0 || status !== 'playing') return;

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    dispatch({ type: 'FINISH_QUIZ' });
  }, [timeLeft, status]);

  useEffect(() => {
    if (!questions || status !== 'answered') return;

    const timeoutId = setTimeout(() => {
      dispatch({ type: 'NEXT_QUESTION', payload: { total: questions.length } });
    }, 900);

    return () => clearTimeout(timeoutId);
  }, [status, questions]);

  useEffect(() => {
    if (status !== 'finished') return;

    updateBestScore(score);

    if (!scoreSubmittedRef.current) {
      scoreSubmittedRef.current = true;
      apiFetch('/api/users/score', {
        method: 'POST',
        body: JSON.stringify({ score }),
      })
        .then((user) => {
          if (typeof user?.bestScore === 'number') {
            updateBestScore(user.bestScore);
          }
        })
        .catch((err) => {
          console.error('Erreur lors de l envoi du score :', err);
        });
    }

    navigate('/resultats', { state: { score, total: questions?.length || 0 } });
  }, [status, score, questions, navigate, updateBestScore]);

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--apple-blue)' }} />
      </div>
    );
  }

  if (error || !questions?.length) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--apple-red)', textAlign: 'center' }}>
        <h2>Erreur : {error || 'Impossible de charger les questions.'}</h2>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  const getOptionStatus = (option) => {
    if (status !== 'answered') return 'default';
    if (option === question.correctAnswer) return 'correct';
    if (question.options[selectedOption] === option) return 'wrong';
    return 'default';
  };

  const getOptionStyle = (option) => {
    if (status !== 'answered') return {};
    if (option === question.correctAnswer) {
      return {
        boxShadow: '0 0 0 2px var(--apple-green), 0 0 24px rgba(52, 199, 89, 0.65)',
      };
    }
    if (question.options[selectedOption] === option) {
      return {
        boxShadow: '0 0 0 2px var(--apple-red), 0 0 24px rgba(255, 59, 48, 0.55)',
      };
    }
    return {};
  };

  const handleSubmit = () => {
    if (status !== 'playing' || selectedOption === null) return;

    dispatch({
      type: 'ANSWER_QUESTION',
      payload: {
        selectedAnswer: question.options[selectedOption],
        correctAnswer: question.correctAnswer,
      },
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes points-float-up {
          0% { opacity: 0; transform: translateY(0) scale(0.9); }
          10% { opacity: 1; transform: translateY(-6px) scale(1); }
          100% { opacity: 0; transform: translateY(-52px) scale(1.07); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <div className="progress-container" style={{ marginBottom: 0 }}>
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          color: 'var(--apple-blue)', fontWeight: 800, fontSize: '1rem',
          background: 'var(--apple-blue-light)',
          border: '1px solid var(--apple-blue)',
          borderRadius: '99px', padding: '4px 12px',
          whiteSpace: 'nowrap'
        }}>
          <Zap size={16} fill="var(--apple-blue)" />
          {score} pts
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: timeLeft <= 10 ? 'var(--apple-red)' : 'var(--apple-green)',
          fontWeight: 800, fontSize: '1.1rem',
          minWidth: '60px', justifyContent: 'flex-end'
        }}>
          <Timer size={20} />
          <span>0:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem' }}>
            {currentIndex + 1}/{questions.length}
          </span>
          <div style={{
            background: 'var(--apple-purple)', padding: '4px 14px',
            borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700,
            color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {question.category}
          </div>
        </div>

        <h2 style={{ fontSize: '1.7rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
          {question.text}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: 'auto' }}>
          {question.options.map((option, idx) => (
            <Button
              key={option}
              variant="secondary"
              selected={status === 'playing' && selectedOption === idx}
              status={getOptionStatus(option)}
              style={{ position: 'relative', overflow: 'visible', ...getOptionStyle(option) }}
              onClick={() => {
                if (status === 'playing') {
                  dispatch({ type: 'SELECT_OPTION', payload: idx });
                }
              }}
            >
              <span>{option}</span>
              {status === 'answered' && option === question.correctAnswer && <Check color="var(--apple-green)" size={22} />}
              {status === 'answered' && selectedOption === idx && option !== question.correctAnswer && <X color="var(--apple-red)" size={22} />}
              {status === 'answered' && lastAnswerCorrect && option === question.correctAnswer && (
                <span
                  key={`${currentIndex}-${pointsFxSeed}`}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '-6px',
                    pointerEvents: 'none',
                    color: 'var(--apple-green)',
                    fontWeight: 900,
                    fontSize: '1rem',
                    textShadow: '0 2px 10px rgba(52, 199, 89, 0.5)',
                    animation: 'points-float-up 800ms ease-out forwards',
                  }}
                >
                  +1000 pts
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <Button
          variant="primary"
          disabled={selectedOption === null || status !== 'playing'}
          onClick={handleSubmit}
        >
          VERIFIER
        </Button>
      </div>
    </div>
  );
}

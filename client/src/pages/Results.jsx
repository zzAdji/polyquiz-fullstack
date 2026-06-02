import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Trophy, Award, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import { useUser } from '../context/UserContext';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pseudo, bestScore } = useUser();

  // Récupération du score réel transmis par QuizEngine via navigate state
  const score = location.state?.score ?? 0;
  const total = location.state?.total ?? 10;
  const { correctAnswers, ratio } = useMemo(() => {
    const computedCorrectAnswers = score / 1000;
    const computedRatio = total > 0 ? Math.round((computedCorrectAnswers / total) * 100) : 0;
    return { correctAnswers: computedCorrectAnswers, ratio: computedRatio };
  }, [score, total]);
  const isNewBest = score >= bestScore && score > 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' }}>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
          {pseudo ? `Bravo ${pseudo} !` : 'C\'est terminé !'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
          {isNewBest ? '🏆 Nouveau meilleur score !' : 'Tu as fait un super travail.'}
        </p>
      </div>

      {/* Carte Score */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
        width: '100%', padding: '40px 24px', background: 'var(--surface-color)',
        borderRadius: '24px', border: '1px solid var(--border-color)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Award size={64} color="var(--apple-green)" style={{ marginBottom: '16px' }} />
          <div style={{
            fontSize: '4rem', fontWeight: 700, color: 'var(--text-primary)',
            lineHeight: '1', letterSpacing: '-2px'
          }}>
            {score.toLocaleString()}
          </div>
          <div style={{
            color: 'var(--apple-green)', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', marginTop: '8px'
          }}>
            Points
          </div>
        </div>

        {/* Stats */}
        <div style={{
          background: 'var(--bg-color)', padding: '16px', borderRadius: '16px',
          width: '100%', display: 'flex', justifyContent: 'space-around',
          border: '1px solid var(--border-color)'
        }}>
          {/* Précision */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--apple-blue)' }}>{ratio}%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Précision</div>
          </div>

          <div style={{ width: '1px', background: 'var(--border-color)' }} />

          {/* Réponses correctes */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--apple-green)' }}>
              {correctAnswers}/{total}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Correctes</div>
          </div>

          {/* Meilleur score — affiché si on en a un */}
          {bestScore > 0 && (
            <>
              <div style={{ width: '1px', background: 'var(--border-color)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Star size={16} color="var(--apple-blue)" />
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--apple-blue)' }}>
                    {bestScore.toLocaleString()}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Meilleur</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <Button
          variant="secondary"
          onClick={() => navigate('/leaderboard')}
          style={{ justifyContent: 'center', color: 'var(--apple-purple)' }}
        >
          <Trophy size={24} />
          Classement Global
        </Button>

        <Button variant="primary" onClick={() => navigate('/')}>
          <Home size={24} />
          RETOUR À L'ACCUEIL
        </Button>
      </div>

    </div>
  );
}

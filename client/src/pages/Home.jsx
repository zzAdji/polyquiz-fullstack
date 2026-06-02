import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, User, ChevronRight, Star, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useUser } from '../context/UserContext';
import { apiFetch } from '../config/api';
import { useFetch } from '../hooks/useFetch';

export default function Home() {
  const { pseudo, setPseudo, setToken, bestScore } = useUser();
  const [inputValue, setInputValue] = useState(pseudo || '');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { data: leaderboardData, loading, error } = useFetch('/api/leaderboard');
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    const normalizedPseudo = inputValue.trim();
    if (!normalizedPseudo) return;

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ pseudo: normalizedPseudo }),
      });

      setPseudo(normalizedPseudo);
      setToken(response.token);
      navigate('/quiz');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const top3 = (leaderboardData?.length ? leaderboardData : []).slice(0, 3).map((player, index) => ({
    rank: index + 1,
    name: player.pseudo || player.name,
    score: player.score,
  }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '32px' }}>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>
          {pseudo ? `Bon retour, ${pseudo}` : 'PolyQuiz'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 500 }}>
          {pseudo ? 'Prêt pour tous les battre ?' : 'Montre que tu es le plus fort.'}
        </p>
      </div>

      {/* Meilleur score de l'utilisateur*/}
      {pseudo && bestScore > 0 && (
        <div style={{
          background: 'var(--apple-gold-light)',
          border: '1px solid var(--apple-gold)',
          borderRadius: '20px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Star size={22} color="var(--apple-gold)" />
            <span style={{ fontWeight: 700, color: 'var(--apple-gold)' }}>Votre meilleur score</span>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--apple-gold)' }}>
            {bestScore} pts
          </span>
        </div>
      )}

      <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          icon={User}
          type="text"
          placeholder="Entrez votre pseudo..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!inputValue.trim() || isLoggingIn}
          style={{ marginTop: '8px' }}
        >
          {isLoggingIn ? 'CONNEXION...' : 'COMMENCER'}
        </Button>
        {loginError && (
          <p style={{ color: 'var(--apple-red)', fontWeight: 700, textAlign: 'center' }}>
            {loginError}
          </p>
        )}
      </form>

      {/* Leaderboard Preview */}
      <div style={{
        background: 'var(--surface-color)',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 700 }}>
          <Trophy size={20} color="#FFD700" />
          <span>Top 3 Mondial</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--apple-blue)' }} />
            </div>
          )}

          {error && (
            <p style={{ color: 'var(--apple-red)', textAlign: 'center', fontWeight: 700 }}>
              {error}
            </p>
          )}

          {!loading && !error && leaderboardData.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 700 }}>
              Aucun score enregistre pour le moment.
            </p>
          )}
          
          {top3.map(player => (
            <div key={player.rank} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{
                  color: player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : '#CD7F32',
                  fontWeight: 800, width: '20px'
                }}>#{player.rank}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{player.name}</span>
              </div>
              <span style={{ color: 'var(--apple-blue)', fontWeight: 700 }}>{player.score} pts</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            background: 'none', border: 'none', color: 'var(--apple-blue)',
            fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '4px', marginTop: '8px', cursor: 'pointer', fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        >
          Voir tout le classement
          <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
}

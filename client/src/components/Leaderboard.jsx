import React, { useMemo } from 'react';
import { Loader2, Trophy, X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useFetch } from '../hooks/useFetch';

export default function Leaderboard({ onClose }) {
  const { pseudo, bestScore } = useUser();
  const { data, loading, error } = useFetch('/api/leaderboard');

  const leaderboardData = useMemo(() => {
    const apiRows = Array.isArray(data)
      ? data.map((player) => ({
          name: player.pseudo,
          score: player.score,
          isCurrentUser: pseudo?.toLowerCase() === player.pseudo?.toLowerCase(),
        }))
      : [];

    const hasPlayableUser = Boolean(pseudo);
    const userAlreadyListed = apiRows.some((player) => player.isCurrentUser);

    if (hasPlayableUser && !userAlreadyListed && bestScore > 0) {
      apiRows.push({ name: pseudo, score: bestScore, isCurrentUser: true });
    }

    return apiRows
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({ ...player, rank: index + 1 }));
  }, [data, pseudo, bestScore]);

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{
      background: 'var(--surface-color)',
      borderRadius: '24px',
      padding: '24px',
      border: '1px solid var(--border-color)',
      position: 'relative',
      width: '100%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
    }}>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Fermer le classement"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={24} />
        </button>
      )}

      <h2 style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-primary)',
        justifyContent: 'center'
      }}>
        <Trophy size={28} color="#FFD700" />
        Classement Global
      </h2>

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

      {!loading && !error && leaderboardData.length > 0 && (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {leaderboardData.map((player) => (
            <li key={`${player.name}-${player.rank}`} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '16px',
              background: player.isCurrentUser ? 'var(--apple-blue-light)' : 'var(--bg-color)',
              borderRadius: '16px',
              border: player.isCurrentUser ? '2px solid var(--apple-blue)' : '1px solid var(--border-color)',
              boxShadow: player.isCurrentUser ? '0 0 20px rgba(0, 122, 255, 0.22)' : 'none',
              fontWeight: 600
            }}>
              <span style={{
                fontSize: '1.2rem',
                color: getRankColor(player.rank),
                width: '40px',
                fontWeight: 700
              }}>
                #{player.rank}
              </span>
              <span style={{ flex: 1, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {player.name}
                </span>
                {player.isCurrentUser && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#fff',
                    background: 'var(--apple-blue)',
                    borderRadius: '999px',
                    padding: '2px 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Vous
                  </span>
                )}
              </span>
              <span style={{ color: 'var(--apple-blue)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {player.score.toLocaleString()} pts
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

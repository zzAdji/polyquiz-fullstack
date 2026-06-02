import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import Button from '../components/ui/Button';

export default function LeaderboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
      <Leaderboard />
      <Button variant="primary" onClick={() => navigate('/')}>
        <Home size={24} />
        RETOUR A L'ACCUEIL
      </Button>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeamPage({ params }) {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  useEffect(() => {
    if (user) {
      loadTeamData();
    }
  }, [user, params.id]);

  const loadTeamData = async () => {
    try {
      const res = await fetch(`/api/teams/${params.id}`);
      const data = await res.json();
      
      if (data.team) {
        setTeam(data.team);
        setGames(data.games || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading team:', err);
      setLoading(false);
    }
  };

  const handleAttendance = async (gameId, status) => {
    try {
      console.log('Updating attendance:', { gameId, userId: user.id, status });
      
      const res = await fetch(`/api/games/${gameId}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, status })
      });

      const data = await res.json();
      console.log('Response:', data);

      if (res.ok) {
        await loadTeamData();
        console.log('Data reloaded');
      } else {
        console.error('Error response:', data);
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
    }
  };

  const getUserStatus = (game) => {
    if (!game.attendance) return null;
    const userAttendance = game.attendance.find(
      a => {
        const aUserId = typeof a.userId === 'object' ? a.userId.toString() : a.userId;
        const currentUserId = typeof user.id === 'object' ? user.id.toString() : user.id;
        return aUserId === currentUserId;
      }
    );
    return userAttendance?.status;
  };

  const getAttendanceCounts = (game) => {
    if (!game.attendance) return { in: 0, out: 0 };
    const inCount = game.attendance.filter(a => a.status === 'in').length;
    const outCount = game.attendance.filter(a => a.status === 'out').length;
    return { in: inCount, out: outCount };
  };

  if (loading || !user) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (!team) return <div style={{ padding: '20px' }}>Team not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <button 
        onClick={() => router.push('/dashboard')}
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        Back to Dashboard
      </button>

      <h1>{team.name}</h1>
      <p>{team.description}</p>

      <h2 style={{ marginTop: '30px' }}>Schedule</h2>

      {games.length === 0 ? (
        <p>No games scheduled</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {games.map(game => {
            const userStatus = getUserStatus(game);
            const counts = getAttendanceCounts(game);
            
            return (
              <div 
                key={game._id}
                style={{ 
                  border: '1px solid #ccc', 
                  padding: '20px', 
                  marginBottom: '15px' 
                }}
              >
                <h3>{game.opponent}</h3>
                <p>Date: {new Date(game.date).toLocaleDateString()}</p>
                <p>Location: {game.location}</p>
                
                <div style={{ marginTop: '15px' }}>
                  <p>In: {counts.in} | Out: {counts.out}</p>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      onClick={() => handleAttendance(game._id, 'in')}
                      style={{
                        padding: '10px 20px',
                        cursor: 'pointer',
                        backgroundColor: userStatus === 'in' ? '#4CAF50' : 'white',
                        color: userStatus === 'in' ? 'white' : 'black',
                        border: '1px solid #4CAF50'
                      }}
                    >
                      In
                    </button>
                    
                    <button
                      onClick={() => handleAttendance(game._id, 'out')}
                      style={{
                        padding: '10px 20px',
                        cursor: 'pointer',
                        backgroundColor: userStatus === 'out' ? '#f44336' : 'white',
                        color: userStatus === 'out' ? 'white' : 'black',
                        border: '1px solid #f44336'
                      }}
                    >
                      Out
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
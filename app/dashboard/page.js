'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setTeams([]);
      return;
    }

    try {
      const res = await fetch(`/api/teams/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setTeams(data.teams || []);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <p>Welcome, {user.name}</p>

      <div style={{ marginTop: '30px' }}>
        <h2>Find Your Team</h2>
        <input
          type="text"
          placeholder="Search for a team..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px', marginTop: '10px' }}
        />

        {teams.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            {teams.map(team => (
              <div 
                key={team._id}
                onClick={() => router.push(`/team/${team._id}`)}
                style={{ 
                  padding: '15px', 
                  border: '1px solid #ccc', 
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}
              >
                <h3>{team.name}</h3>
                <p>{team.description || 'No description'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

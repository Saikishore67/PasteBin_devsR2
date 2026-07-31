import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PasteList({ onlyMine = false }) {
  const { email } = useAuth();
  const [pastes, setPastes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pastes/')
      .then((res) => {
        const data = res.data;
        const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        setPastes(onlyMine ? items.filter((paste) => paste.owner === email) : items);
      })
      .catch(() => setError('Failed to load pastes'))
      .finally(() => setLoading(false));
  }, [onlyMine, email]);

  return (
    <div className="container">
      <div className="row-between" style={{ marginBottom: 20 }}>
        <div>
          <h1>{onlyMine ? 'my pastes' : 'snippets'}</h1>
          <p className="subtitle" style={{ marginBottom: 0 }}>{onlyMine ? 'Pastes you created' : 'Public and your own pastes'}</p>
        </div>
        <Link to="/create" className="btn btn-primary">+ new paste</Link>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <p className="subtitle">loading...</p>
      ) : pastes.length === 0 ? (
        <div className="empty-state">
          // no pastes yet — create the first one
        </div>
      ) : (
        pastes.map((paste) => (
          <Link to={`/pastes/${paste.id}`} key={paste.id} style={{ textDecoration: 'none' }}>
            <div className="card row-between">
              <div className="paste-card-content">
                <strong style={{ color: 'var(--text)' }}>{paste.title || 'Untitled'}</strong>
                <div className="subtitle" style={{ margin: '4px 0 0', fontSize: 12 }}>
                  {paste.language}
                </div>
                <div className="paste-preview">{paste.content || '// empty paste'}</div>
              </div>
              <span className={`badge badge-${paste.visibility}`}>{paste.visibility}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

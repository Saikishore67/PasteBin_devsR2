import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ViewPaste() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { email } = useAuth();

  useEffect(() => {
    api.get(`/pastes/${id}/`)
      .then((res) => setPaste(res.data))
      .catch(() => setError('Paste not found or access denied'));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this paste?')) return;
    try {
      await api.delete(`/pastes/${id}/`);
      navigate('/');
    } catch (err) {
      setError('Failed to delete');
    }
  };

  if (error) return <div className="container"><div className="error-box">{error}</div></div>;
  if (!paste) return <div className="container"><p className="subtitle">loading...</p></div>;

  const isOwner = paste.owner === email;

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <Link to="/">&larr; back</Link>
      <div className="row-between" style={{ marginTop: 12 }}>
        <h1>{paste.title || 'Untitled'}</h1>
        <span className={`badge badge-${paste.visibility}`}>{paste.visibility}</span>
      </div>
      <p className="subtitle">{paste.language}</p>
      <pre className="code-block">{paste.content}</pre>
      {isOwner && (
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Link to={`/pastes/${id}/edit`} className="btn">edit</Link>
          <button className="btn btn-danger" onClick={handleDelete}>delete</button>
        </div>
      )}
    </div>
  );
}

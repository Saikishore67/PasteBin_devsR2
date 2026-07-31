import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function EditPaste() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('');
  const [visibility, setVisibility] = useState('unlisted');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/pastes/${id}/`).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content);
      setLanguage(res.data.language);
      setVisibility(res.data.visibility);
    }).catch(() => setError('Failed to load paste'));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.patch(`/pastes/${id}/`, { title, content, language, visibility });
      navigate(`/pastes/${id}`);
    } catch (err) {
      setError('Failed to update. You may not own this paste.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <h1>edit paste</h1>
      {error && <div className="error-box">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Content</label>
          <textarea className="textarea" rows={12} value={content}
            onChange={(e) => setContent(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Language</label>
          <input className="input" value={language} onChange={(e) => setLanguage(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Visibility</label>
          <select className="select" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="private">Private</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-block">Save changes</button>
      </form>
    </div>
  );
}

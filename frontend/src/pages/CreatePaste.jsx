import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CreatePaste() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [visibility, setVisibility] = useState('unlisted');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/pastes/', { title, content, language, visibility });
      navigate(`/pastes/${res.data.id}`);
    } catch (err) {
      setError('Failed to create paste');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <h1>new paste</h1>
      <p className="subtitle">Save a text or code snippet</p>
      {error && <div className="error-box">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Content</label>
          <textarea className="textarea" rows={12} value={content}
            onChange={(e) => setContent(e.target.value)} required />
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
        <button type="submit" className="btn btn-primary btn-block">Create paste</button>
      </form>
    </div>
  );
}

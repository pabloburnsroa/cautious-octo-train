import { useState } from 'react';
import './Signup.css';
import { useSignup } from '../../hooks/useSignup';

export default function Signup() {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { signup, error, isPending } = useSignup();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName, thumbnail);
  };

  // Handle the thumbnail selection
  const handleFileChange = (e) => {
    setThumbnail(null);
    let selected = e.target.files[0];
    console.log(selected);

    if (!selected) {
      setThumbnailError('Please select a file');
      return;
    }
    if (!selected.type.includes('image')) {
      setThumbnailError('Selected file must be an image');
      return;
    }
    if (selected.size > 100000) {
      setThumbnailError('Image file size must be less than 100kb');
      return;
    }

    setThumbnailError(null);
    setThumbnail(selected);
    console.log(thumbnail);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        <span>Email:</span>
        <input
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span> Password:</span>
        <input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      <label>
        <span>Display Name:</span>
        <input
          required
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      <label>
        <span>Profile Thumbnail</span>
        <input required type="file" onChange={handleFileChange} />
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      {!isPending && <button className="btn">Sign up</button>}
      {isPending && (
        <button className="btn" disabled>
          Loading
        </button>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
}

import { useState } from 'react';

const ShareProject = ({ projectId }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmailOrUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/projects/${projectId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Failed to share project');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={emailOrUsername}
          onChange={handleChange}
          placeholder="Enter username or email"
          className="p-2 border rounded-l"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600">
          Share
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ShareProject;

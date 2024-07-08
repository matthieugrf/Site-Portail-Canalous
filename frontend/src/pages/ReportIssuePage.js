import React, { useState } from 'react';
import api from '../services/api';

const ReportIssuePage = () => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    api.post('/issue-reports/', { location, description })
      .then(response => {
        alert('Issue reported successfully!');
        setLocation('');
        setDescription('');
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div>
      <h1>Report Issue Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <button type="submit">Report Issue</button>
      </form>
    </div>
  );
};

export default ReportIssuePage;

import React, { useEffect, useState } from 'react';
import api from '../services/api';

const UserProfilePage = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    api.get('/user-profiles/')
      .then(response => {
        setProfiles(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div>
      <h1>User Profile Page</h1>
      <ul>
        {profiles.map(profile => (
          <li key={profile.id}>{profile.user.username} - {profile.bio}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfilePage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Profile() {
  const { userId } = useParams();
  const { user: authUser } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);

  const isMyProfile = authUser?._id === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/users/${userId}`, {
          withCredentials: true,
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userId]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profile.username}</h1>
      <p>Email: {profile.email}</p>

      {isMyProfile ? (
        <div>
          <button>Edit Profile</button>
          <button>Upload Photo</button>
        </div>
      ) : (
        <div>
          <button>Follow</button>
          <button>Message</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
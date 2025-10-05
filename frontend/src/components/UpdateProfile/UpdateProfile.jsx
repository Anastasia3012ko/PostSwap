import React, { useState } from 'react';
import styles from './UpdateProfile.module.css';
import UpdateAvatar from '../UpdateAvatar/UpdateAvatar';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../redux/slices/userSlice';
import LinkImg from '../../assets/icons/link.svg'
import { Link } from 'react-router-dom';

const UpdateProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    userName: '',
    website: '',
    about: '',
  });
   const [message, setMessage] = useState(null);
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error("User ID is missing!");
      return;
    }

    try {
      const result = await dispatch(updateProfile({ userId, data: form })).unwrap();
      setMessage(result.message);
      setForm({
      userName: '',
      website: '',
      about: '',
    });
    } catch (error) {
      setMessage(error.message);
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Edit profile</h2>
        <Link style={{fontSize: '18px', fontWeight: 'bolder'}} to={`/profile/${userId}`}>X</Link>
      </div>
      
      <div className={styles.updateAvatar}>
        <UpdateAvatar
          size={54}
          border={true}
          showUpdateButton={true}
          user={user}
        />
        <div className={styles.about}>
          <p style={{ fontSize: '16px' }}>{user.userName}</p>
          <p style={{ fontSize: '14px', color: 'var(--text-color)' }}>
            {user.about}
          </p>
        </div>
        </div>
        
        <form onSubmit={handleUpdateProfile} className={styles.form}>
          <div className={styles.inputField}>
          <h3>Username</h3>
          
          <input
            className={styles.input}
            type="text"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
            placeholder="UserName"
          />
        </div>
        <div className={styles.inputField}>
          <h3>Website</h3>
          <span className={styles.icon}><img src={LinkImg} alt="link" /></span>
          <input
            className={styles.input}
            type="text"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="  Website"
          />
        </div>
        <div className={styles.inputField}>
          <h3>About</h3>
          <input
            className={styles.input}
            type="text"
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            placeholder="About"
            maxLength={150}
          />
        </div>
        <button type='submit' className={styles.formButton}>Save</button>
        </form>
        {message && <p className={styles.parMessage}>{message} ✅</p>}
      
    </div>
  );
};

export default UpdateProfile;

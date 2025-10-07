import React from 'react';
import styles from './MyProfileButton.module.css';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/slices/authSlice';
import Logout from '../../assets/icons/logout.svg';

const MyProfileButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <div className={styles.buttonContainer}>
      <Link className={styles.editButton} to="/editProfile">
        Edit profile
      </Link>
      <button className={styles.logout} onClick={handleLogout}>
        <img src={Logout} alt="Logout" />
      </button>
    </div>
  );
};

export default MyProfileButton;

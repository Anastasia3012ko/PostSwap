import React from 'react';
import styles from './UserProfileButton.module.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { followUser, unfollowUser, setIsFollowing, setFollowersCount, setFollowingCount  } from '../../redux/slices/followSlice';

const UserProfileButton = ({ userId }) => {

  const dispatch = useDispatch();
  const {
    isFollowing,
    followersCount,
    followingCount,
    loading,
  } = useSelector((state) => state.follow);

  const handleClick = () => {
  if (isFollowing) {
    dispatch(setIsFollowing(false));
    dispatch(setFollowersCount(followersCount - 1));
    dispatch(setFollowingCount(followingCount - 1));
    dispatch(unfollowUser(userId));
  } else {
    dispatch(setIsFollowing(true));
    dispatch(setFollowersCount(followersCount + 1));
    dispatch(setFollowingCount(followingCount + 1));
    dispatch(followUser(userId));
  }
};

  return (
    <div className={styles.buttonContainer}>
      <button
        className={styles.follow}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
      </button>
      <Link className={styles.message} to="/chat">
        Message
      </Link>
    </div>
  );
};

export default UserProfileButton;

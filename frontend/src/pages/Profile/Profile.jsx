import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserById, clearUser } from '../../redux/slices/userSlice';
import MyProfile from '../../components/MyProfile/MyProfile';
import styles from './Profile.module.css'
import MyProfileButton from '../../components/MyProfileButton/MyProfileButton';
import UserProfileButton from '../../components/UserProfileButton/UserProfileButton';
import { setIsFollowing, setFollowersCount } from '../../redux/slices/followSlice';

function Profile() {
  const { user: authUser } = useSelector((state) => state.auth);
  const { user, loading, error } = useSelector((state) => state.user);
  const { followersCount} = useSelector(state => state.follow);
  const { userId } = useParams();

  const dispatch = useDispatch();

  const isMyProfile = authUser?._id === userId;

  
  useEffect(() => {
    dispatch(fetchUserById(userId))
    .then((res) => {
        if (res.payload) {
          dispatch(setIsFollowing(res.payload.isFollowing || false));
          dispatch(setFollowersCount(res.payload.followersCount || 0));
        }});

    return () => {
      dispatch(clearUser());
    };
  }, [dispatch, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found</p>;
  console.log(user);
  return (
    <div className={styles.wrapper}>
  
      {isMyProfile ? (
        <div>
          <MyProfile user={user}><MyProfileButton/></MyProfile>
        </div>
      ) : (
        <div>
         <MyProfile user={{ ...user, followersCount }}><UserProfileButton userId={userId}/></MyProfile>
        </div>
      )}
    </div>
  );
}

export default Profile;

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserById, clearUser } from '../../redux/slices/userSlice';
import MyProfile from '../../components/MyProfile/MyProfile';
import styles from './Profile.module.css'

function Profile() {
  const { user: authUser } = useSelector((state) => state.auth);
  const { user, loading, error } = useSelector((state) => state.user);
  const { userId } = useParams();

  const dispatch = useDispatch();

  const isMyProfile = authUser?._id === userId;

  useEffect(() => {
    dispatch(fetchUserById(userId));

    return () => {
      dispatch(clearUser());
    };
  }, [dispatch, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className={styles.wrapper}>
      

      {/* Аватар */}
      {isMyProfile ? (
        <div>
          <MyProfile user={user} /> 
        </div>
      ) : (
        <div>
          {/* <ProfileAvatar />{' '} */}
          {/* Можно показывать чужой аватар без редактирования */}
          {/* <button>Follow</button>
          <button>Message</button> */}
        </div>
      )}
    </div>
  );
}

export default Profile;

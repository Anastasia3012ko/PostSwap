import React from 'react';
import styles from './MyProfile.module.css';
import LinkImg from '../../assets/icons/link.svg';
import Avatar from '../Avatar/Avatar';
import Logout from '../../assets/icons/logout.svg';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const MyProfile = ({ user }) => {
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
    <div className={styles.wrapper}>
      <div className={styles.containerOne}>
        <div className={styles.avatar}>
          {user.avatar && (
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarInnerWrapper}>
                <Avatar src={user.avatar.url} size={130} />
              </div>
            </div>
          )}
        </div>
        <div className={styles.allAboutUser}>
          <div className={styles.infoName}>
            <div className={styles.name}>
              <h3 className={styles.userName}>{user.userName}</h3>
              <Link className={styles.editButton} to='/editProfile'>Edit profile</Link>
            </div>

            <button className={styles.logout} onClick={handleLogout}>
              <img src={Logout} alt="Logout" />
            </button>
          </div>
          <div className={styles.infoActive}>
            <p className={styles.par}>
              <span className={styles.number}>{user.postCount || 0}</span>posts
            </p>
            <p className={styles.par}>
              <span className={styles.number}>
                {user.followers?.length || 0}
              </span>
              followers
            </p>
            <p className={styles.par}>
              <span className={styles.number}>
                {user.following?.length || 0}
              </span>
              following
            </p>
          </div>
          <div className={styles.about}>
            <p>{user.about}</p>
          </div>
          <a className={styles.website} href={user.website}>
            <img src={LinkImg} alt="link" />
            {user.website ? user.website : 'https://instgrammm....'}
          </a>
        </div>
      </div>
      <div className={styles.containerTwo}>
        {/* Posts */}
        <ul className={styles.postList}>
          {user.posts?.map((post) => (
            <li className={styles.post} key={post._id}>
              {post.photo && (
                <img className={styles.imagePost} src={post.photo.url} alt="Post" width="100" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyProfile;

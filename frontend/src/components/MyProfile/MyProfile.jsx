import React, { useState } from 'react';
import styles from './MyProfile.module.css';
import LinkImg from '../../assets/icons/link.svg';
import Avatar from '../Avatar/Avatar';
import PostModal from '../PostModal/PostModal';

const MyProfile = ({ user, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      {/* Верхняя часть с инфо о пользователе */}
      <div className={styles.containerOne}>
        <div className={styles.avatar}>
          {user.avatar && (
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarInnerWrapper}>
                <Avatar src={user.avatar.url} size={140} />
              </div>
            </div>
          )}
        </div>
        <div className={styles.allAboutUser}>
          <div className={styles.infoName}>
            <div className={styles.name}>
              <h3 className={styles.userName}>{user.userName}</h3>
            </div>
            <div className={styles.buttonField}>{children}</div>
          </div>
          <div className={styles.infoActive}>
            <p className={styles.par}>
              <span className={styles.number}>{user.postsCount || 0}</span> posts
            </p>
            <p className={styles.par}>
              <span className={styles.number}>{user.followersCount || 0}</span> followers
            </p>
            <p className={styles.par}>
              <span className={styles.number}>{user.followingCount || 0}</span> following
            </p>
          </div>
          <div className={styles.about}>
            <p>{user.about}</p>
          </div>
          <a className={styles.website} href={user.website} target="_blank" rel="noreferrer">
            <img src={LinkImg} alt="link" />
            {user.website ? user.website : 'https://instgrammm....'}
          </a>
        </div>
      </div>

      {/* post list */}
      <div className={styles.containerTwo}>
        <ul className={styles.postList}>
          {user?.posts?.map((post) => (
            <li
              className={styles.postPhoto}
              key={post._id}
              onClick={() => openModal(post)}
            >
              {post.photo && (
                <img
                  className={styles.photo}
                  src={post.photo.url}
                  alt="Post"
                  width="100"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      <PostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        post={selectedPost}
        postUser={user} 
      />
    </div>
  );
};

export default MyProfile;






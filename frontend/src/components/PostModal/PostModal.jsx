import React from 'react';
import styles from './PostModal.module.css';
import Avatar from '../Avatar/Avatar';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import Like from '../../assets/icons/like.svg';
import Comment from '../../assets/icons/comment.svg';
import Emojis from '../Emojis/Emojis';

const PostModal = ({ isOpen, onClose, post, postUser}) => {
  if (!isOpen || !post) return null;
 const userData = typeof post.user === 'object' ? post.user : postUser;
  if (!userData) return null;

  const timeAgo = post.createdAt ? formatTimeAgo(post.createdAt) : null;
console.log('post in modal:', postUser);
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        
        <div className={styles.postWrapper}>
          <div className={styles.postPhoto}>
            <img className={styles.photo} src={post.photo?.url} alt="Post" />
          </div>
          <div className={styles.container}>
            
            <div className={styles.userData}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatarInnerWrapper}>
                  <Link to={`/profile/${userData._id}`}>
                    <Avatar src={userData.avatar?.url} size={27} />
                  </Link>
                </div>
              </div>
              <h4>{post.user.userName}</h4>
              <button className={styles.follow}>follow</button>
            </div>

            <div className={styles.description}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatarInnerWrapper}>
                  <Link to={`/profile/${userData._id}`}>
                    <Avatar src={userData.avatar?.url} size={27} />
                  </Link>
                </div>
              </div>
              <div className={styles.postInfo}>
                <h4 className={styles.username}>{userData.userName}</h4>
                <p className={styles.postText}>{post.description}</p>
                <div className={styles.timeContainer}>
                  {timeAgo && <p className={styles.time}>{timeAgo}</p>}
                </div>
                
              </div>
              
            </div>

            <div className={styles.containerTwo}>
              <div className={styles.icons}>
                <img src={Like} alt="like" />
                <img src={Comment} alt="comment" />
              </div>
              <h4>{post.likesCount} likes</h4>
              <div className={styles.comment}>
                <Emojis
                  onSubmit={(newComment) => {
                    console.log('Новый комментарий:', newComment);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;



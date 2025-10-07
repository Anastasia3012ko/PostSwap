import React from 'react';
import styles from './PostHome.module.css';
import Avatar from '../Avatar/Avatar';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import Like from '../../assets/icons/like.svg';
import Comment from '../../assets/icons/comment.svg';
import { Link } from 'react-router-dom';

const PostHome = ({ post }) => {
  const timeAgo = formatTimeAgo(post.createdAt);
  return (
    <div className={styles.postComponent}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarInnerWrapper}>
            <Link to={`/profile/${post.user._id}`}><Avatar src={post.user.avatar?.url} size={27} /></Link>
          </div>
        </div>
        <div className={styles.info}>
          <h5 className={styles.userName}>{post.user.userName}</h5>
          <div className={styles.dot}><p className={styles.date}>{timeAgo}</p></div>
          <button className={styles.button}>follow</button>
        </div>
      </div>
      <div>
        <Link to={`/post/${post._id}`}> 
        <img
          className={styles.postImage}
          src={post.photo.url}
          alt="Post photo"
        />
        </Link>
      </div>

      <div className={styles.reactions}>
        <div className={styles.icon}>
          <img src={Like} alt="like" />
          <img src={Comment} alt="comment" />
        </div>
        <p className={styles.likes}>{post.likesCount} likes</p>
        {/* <div className={styles.comments}>
          <h4>{post.user.userName}</h4>
          <p>{post.description}</p>
        </div> */}
        <div >
          <p className={styles.comment}>View all comment({post.commentsCount})</p>
        </div>
      </div>
    </div>
  );
};

export default PostHome;

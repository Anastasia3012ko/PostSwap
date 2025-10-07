import React, { useEffect } from 'react';
import styles from './PostModal.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostById } from '../../redux/slices/postSlice';
import Avatar from '../Avatar/Avatar';
import { Link } from 'react-router-dom';

const PostModal = ({ isOpen, onClose, postId }) => {
  const dispatch = useDispatch();
  const { currentPost, loading, error } = useSelector(
    (state) => state.post || {}
  );

  useEffect(() => {
    if (isOpen && postId) {
      dispatch(fetchPostById(postId));
    }
  }, [dispatch, postId, isOpen]);

  if (!isOpen) return null;
  console.log(currentPost);
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {!loading && currentPost && (
          <div className={styles.postWrapper}>
            <div className={styles.postPhoto}>
              <img className={styles.photo} src={currentPost.photo?.url} alt="Post" />
            </div>
            <div className={styles.container}>
              <div className={styles.userData}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarInnerWrapper}>
                    <Link to={`/profile/${currentPost.user._id}`}>
                      <Avatar src={currentPost.user.avatar?.url} size={27} />
                    </Link>
                  </div>
                </div>
                <h4>{currentPost.user.userName}</h4>
              </div>
              <p>{currentPost.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostModal;

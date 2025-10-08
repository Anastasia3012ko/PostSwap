import React, { useState, useEffect } from 'react';
import styles from './PostModal.module.css';
import Avatar from '../Avatar/Avatar';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import Like from '../../assets/icons/like.svg';
import Comment from '../../assets/icons/comment.svg';
import Emojis from '../Emojis/Emojis';
import { useSelector, useDispatch } from 'react-redux';
import { deletePostById, updatePost } from '../../redux/slices/postSlice';

const PostModal = ({ isOpen, onClose, post, postUser }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(post?.description || '');
  
  useEffect(() => {
  setNewDescription(post?.description || '');
}, [post])

  if (!isOpen || !post) return null;

  const userData = typeof post.user === 'object' ? post.user : postUser;
  if (!userData) return null;

  const toggleOptions = () => {
    setIsOptionsOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deletePostById(post._id)).unwrap();
      setIsOptionsOpen(false);
      onClose();
    } catch (error) {
      console.error('Error with deleting post:', error);
    }
  };

  const handleUpdateDescription = async () => {
    try {
      const formData = new FormData();
      formData.append('description', newDescription);

      await dispatch(updatePost({ postId: post._id, formData })).unwrap();

      console.log('Description updated:', newDescription);
      setIsEditing(false);
    } catch (error) {
      console.error('Error with updating description:', error);
    }
  };

  const handleEdit = () => {
    setIsOptionsOpen(false);
    setIsEditing(true);
  };

  const handleCopyLink = async () => {
    try {
      const link = `${window.location.origin}/${post._id}`;
      await navigator.clipboard.writeText(link);
      console.log('Link copied:', link);
      setIsOptionsOpen(false);
    } catch (error) {
      console.error('Error with copying link:', error);
    }
  };
  
  const timeAgo = post.updatedAt ? formatTimeAgo(post.updatedAt) : null;

  console.log('post in modal:', post);
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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
              <h4>{userData.userName}</h4>

              {currentUser?._id === userData._id ? (
                <>
                  {/* Кнопка открытия маленького модального окна */}
                  <button className={styles.optionsBtn} onClick={toggleOptions}>
                    ⋯
                  </button>

                  {/* Маленькое модальное окно с действиями */}
                  {isOptionsOpen && (
                    <div
                      className={styles.optionsModal}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button style={{color: 'red'}} onClick={handleDelete}>Delete</button>
                      <button onClick={handleEdit}>Edit</button>
                      <button onClick={handleCopyLink}>Copy link</button>
                      <button onClick={() => setIsOptionsOpen(false)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.buttonGroup}>
                  <button className={styles.follow}>follow</button>
                </div>
              )}
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

                {isEditing ? (
                  <div className={styles.textarea}>
                    <textarea
                      className={styles.textUpdateWindow}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      rows={3}
                      style={{ width: '100%' }}
                    />
                    <div className={styles.areaButton}>
                      <button className={styles.btn}  onClick={handleUpdateDescription}>Save</button>
                      <button className={styles.btn} onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                    
                  </div>
                ) : (
                  <p className={styles.postText}>{newDescription}</p>
                )}
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

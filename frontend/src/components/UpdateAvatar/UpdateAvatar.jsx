import React, { useRef, useState, useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvatar } from '../../redux/slices/userSlice';
import styles from './UpdateAvatar.module.css';
import Avatar from '../Avatar/Avatar';

const UpdateAvatar = ({
  size = 130,
  showUpdateButton = true,
  user = user
}) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const avatarUrl = user?.avatar?.url || null;

  const dispatch = useDispatch();
  const registeredUserId = useSelector(state => state.auth.user?._id);
  const newAvatarUrl = useSelector(state => state.user.user?.avatar);

  useEffect(() => {
    if (!showModal) {
      setImage(null);
      setScale(1);
      setError(null);
      setLoading(false);
    }
  }, [showModal]);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large (max 5MB)');
      return;
    }

    setError(null);
    setImage(file);
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (!editorRef.current || !image || !registeredUserId) return;
    setLoading(true);
    setError(null);

    try {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, 'image/png')
      );

      if (!blob) throw new Error('Failed to create image');

      const formData = new FormData();
      formData.append('avatar', blob, 'avatar.png');

      const resultAction = await dispatch(
        updateAvatar({ userId: registeredUserId, avatar: formData })
      );

      if (updateAvatar.fulfilled.match(resultAction)) {
        setShowModal(false);
      } else {
        setError(resultAction.error?.message || 'Failed to update avatar');
      }
    } catch {
      setError('Avatar upload failed');
    } finally {
      setLoading(false);
    }
  };

  const openFileDialog = () => fileInputRef.current && fileInputRef.current.click();

  return (
    <div className={styles.wrapper}>
      {/* Avatar display */}
      <div className={styles.avatarWrapper}>
        <Avatar
          src={!newAvatarUrl ? avatarUrl : newAvatarUrl }
          size={size}
        />

        {/* Optional button */}
      {showUpdateButton && (
        <button className={styles.updateButton} onClick={openFileDialog}>New photo</button>
      )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className={styles.fileInput}
        onChange={handleFileChange}
      />

      

      {/* Modal */}
      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            {image && (
              <AvatarEditor
                ref={editorRef}
                image={image}
                width={200}
                height={200}
                border={50}
                borderRadius={100}
                scale={scale}
              />
            )}

            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={scale}
              onChange={e => setScale(parseFloat(e.target.value))}
              className={styles.scaleInput}
              disabled={!image}
            />

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setImage(null);
                  setError(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateAvatar;
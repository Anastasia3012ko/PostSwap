import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvatar } from '../../redux/slices/userSlice';
import styles from './UpdateAvatar.module.css';
import Avatar from '../Avatar/Avatar';
import getCroppedImage from '../../utils/getCoppedImage';

const UpdateAvatar = ({ size = 130, showUpdateButton = true, user = user }) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const registeredUserId = useSelector((state) => state.auth.user?._id);
  const newAvatarUrl = useSelector((state) => state.user.user?.avatar);

  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const avatarUrl = user?.avatar?.url || null;

  useEffect(() => {
    if (!showModal) {
      setImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
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
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setShowModal(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!image || !registeredUserId || !croppedAreaPixels) return;
    setLoading(true);
    setError(null);

    try {
      const croppedFile = await getCroppedImage(image, croppedAreaPixels);

      const formData = new FormData();
      formData.append('avatar', croppedFile, 'avatar.png');

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
  }, [image, croppedAreaPixels, registeredUserId, dispatch]);

  const openFileDialog = () =>
    fileInputRef.current && fileInputRef.current.click();

  const handleDelete = () => {
    setImage(null);
    setShowModal(false);
    dispatch(updateAvatar({ userId: registeredUserId, avatar: null }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatarWrapper}>
        <Avatar src={newAvatarUrl || avatarUrl} size={size} />
        {showUpdateButton && (
          <button className={styles.updateButton} onClick={openFileDialog}>
            New photo
          </button>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className={styles.fileInput}
        onChange={handleFileChange}
      />

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {image && (
              <div className={styles.cropContainer}>
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  minZoom={1}
                  maxZoom={3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
                {/* круглая маска поверх */}
                <div className={styles.cropRoundMask}></div>

                {/* слайдер масштаба */}
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className={styles.scaleInput}
                />
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleDelete}>Delete</button>
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

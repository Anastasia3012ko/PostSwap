import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { useDispatch } from 'react-redux';
import { createPost } from '../../redux/slices/postSlice';
import getCroppedImage from '../../utils/getCoppedImage';
import styles from './CreatePostModal.module.css';
import PhotoPost from '../../assets/icons/photopost.svg';
import { useSelector } from 'react-redux';
import Avatar from '../Avatar/Avatar';

const emojiList = [
  "😀", "😃", "😄", "😁", "😆",
  "😅", "🤣", "😂", "🙂", "🙃",
  "😉", "😊", "😇", "🥰", "😍",
  "🤩", "😘", "😗", "😚", "😙",
  "😋", "😜", "🤪", "😝", "🤑",
  "🤗", "🤭", "🤫", "🤔", "🤐",
  "😶", "😏", "😒", "🙄", "😬",
  "🥴", "🥳", "🤯", "😎", "🤓",
  "😡", "😠", "🤬", "😱", "😨",
  "😰", "😥", "😢", "😭", "💀"
];

const MAX_DESCRIPTION_LENGTH = 200;

const CreatePostModal = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [description, setDescription] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setImageUrl(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
  });

  const handleEmojiClick = (emoji) => {
    if (description.length < MAX_DESCRIPTION_LENGTH) {
      setDescription((prev) => prev + emoji);
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmitPost = async () => {
    if (!selectedFile || !croppedAreaPixels) {
      alert('Please select and crop an image!');
      return;
    }

    try {
      const croppedFile = await getCroppedImage(imageUrl, croppedAreaPixels);

      const formData = new FormData();
      formData.append('photo', croppedFile);
      formData.append('description', description);

      await dispatch(createPost(formData)).unwrap();

      setSelectedFile(null);
      setImageUrl(null);
      setDescription('');
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post: ' + error.message);
    }
  };

  if (!isOpen) return null;
  const currentLength = description.length;
  


  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.headerRow}>
          <h3 className={styles.header}>Create new post</h3>
          <button className={styles.buttonShare} onClick={handleSubmitPost}>
            Share
          </button>
        </div>

        <div className={styles.body}>
          {/* Left side: Dropzone / Cropper */}
          <div className={styles.leftSide}>
            {!selectedFile ? (
              <div {...getRootProps()} className={styles.dropzone}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop image here...</p>
                ) : (
                  <img src={PhotoPost} alt='Upload a photo' />
                )}
              </div>
            ) : (
              <div className={styles.cropWrapper}>
                <div className={styles.cropContainer}>
                  <Cropper
                    image={imageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className={styles.zoomSlider}
                />
              </div>
            )}
          </div>

          {/* Right side: Description + emojis + counter */}
          <div className={styles.rightSide}>
            <div className={styles.userData}>
              <Avatar size={38} src={user?.avatar?.url} />
            <h5 className={styles.userName}>{user.userName}</h5>
            </div>
             
            
            <textarea
              className={styles.textarea}
              placeholder="Write a caption..."
              value={description}
              onChange={handleDescriptionChange}
            />

            <div className={styles.charCounter}>
              {currentLength}/{MAX_DESCRIPTION_LENGTH} chars
            </div>

            <div className={styles.emojiBar}>
              <button
                type="button"
                className={styles.emojiToggle}
                onClick={() => setShowEmojis((prev) => !prev)}
              >
                😀
              </button>
              {showEmojis && (
                <div className={styles.emojiPicker}>
                  {emojiList.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      className={styles.emojiBtn}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;






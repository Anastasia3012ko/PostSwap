import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import styles from './CreatePostModal.module.css';

const emojiList = [
  '😀','😂','😍','😎','😢','😡','🤔','🤗',
  '👍','👎','🙏','👏','💪','❤️','💔','🎉',
  '🥳','😴','🤯','😱','🤩','😇','🤪','🙃',
  '😋','😜','😏','🤤','🤫','😬','🫡','🥰'
];

const CreatePostModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [description, setDescription] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  const handleEmojiClick = (emoji) => {
    setDescription((prev) => prev + emoji);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.headerRow}>
          <h3 className={styles.header}>Create new post</h3>
          <button className={styles.buttonShare}>Share</button>
        </div>

        <div className={styles.body}>
          {/* Левая половина */}
          <div className={styles.leftSide}>
            {!selectedFile ? (
              <div {...getRootProps()} className={styles.dropzone}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop image here...</p>
                ) : (
                  <p>Drag & drop an image or click to select</p>
                )}
              </div>
            ) : (
              <div className={styles.cropContainer}>
                <Cropper
                  image={selectedFile}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                />
              </div>
            )}
          </div>

          {/* Правая половина */}
          <div className={styles.rightSide}>
            <textarea
              className={styles.textarea}
              placeholder="Write a caption..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
                  {emojiList.map((emoji) => (
                    <button
                      key={emoji}
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

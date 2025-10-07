import React from 'react';
import styles from './CreatePostModal.module.css'

const createPostModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default createPostModal;

import React from 'react';
import styles from './Avatar.module.css';

const Avatar = ({ src, alt = 'User avatar', size = 50, onClick }) => {
  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {src ? (
        <img src={src} alt={alt} className={styles.img} />
      ) : (
        <div className={styles.placeholder}>No avatar</div>
      )}
    </div>
  );
};

export default Avatar;

import React from 'react';
import styles from './ModalToLogin.module.css';
import { useNavigate } from 'react-router-dom';

const Modal = ({ message, buttonName, onClose, showLoginButton }) => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
    onClose();
  };

  if (!message) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p>{message}</p>
        <button className={styles.close} onClick={onClose}>
          X
        </button>

        {showLoginButton && (
          <button className={styles.button} onClick={handleGoToLogin}>
            {buttonName}
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;

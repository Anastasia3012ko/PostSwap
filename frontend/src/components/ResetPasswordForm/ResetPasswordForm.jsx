import React from 'react';
import styles from './ResetPasswordForm.module.css';
import Lock from '../../assets/icons/lock.svg';
import { Link } from 'react-router-dom';

const ResetPasswordForm = () => {
  return (
    <div className={styles.resetForm}>
      <div className={styles.containerOne}>
        <img className={styles.lock} src={Lock} alt="reset password" />
        <h3>Trouble logging in?</h3>
        <p className={styles.par}>
          Enter your email, phone, or username and we'll send you a link to get
          back into your account.
        </p>
        <form className={styles.form}>
          <div className={styles.inputField}>
            <input
              className={styles.input}
              type="text"
              placeholder="Email or Username"
            />
          </div>
          <button className={styles.button}>Reset your password</button>
          <div className={styles.or}>
            <div className={styles.line}></div>
            <span style={{ padding: '0 10px' }}>OR</span>
            <div className={styles.line}></div>
          </div>
        </form>
        <Link
          style={{ color: 'rgba(38, 38, 38, 1)', marginBottom: '85px' }}
          to={'/register'}
        >
          Create new account
        </Link>
      </div>

      <div className={styles.containerTwo}>
        <Link style={{ color: 'rgba(38, 38, 38, 1)' }} to={'/login'}>
          Back to login
        </Link>{' '}
      </div>
    </div>
  );
};

export default ResetPasswordForm;

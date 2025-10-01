import React from 'react'
import styles from './ChangePassword.module.css'
import Lock from '../../assets/icons/lock.svg';
import { Link } from 'react-router-dom';

const ChangePassword = () => {
  return (
    <div className={styles.resetForm}>
          <div className={styles.containerOne}>
            <img className={styles.lock} src={Lock} alt="reset password" />
            <h3>Change Rassword</h3>
            <p className={styles.par}>
              Please enter your new password and the verification code from the Email
            </p>
            <form className={styles.form}>
              <div className={styles.inputField}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Verification code"
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Your new password"
                />
              </div>
              <button className={styles.button}>Change your password</button>
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
  )
}

export default ChangePassword
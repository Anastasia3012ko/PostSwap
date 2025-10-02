import React from 'react';
import styles from './LoginForm.module.css';
import Phones from '../../assets/images/phone.png';
import Logo from '../../assets/images/postswap.png';
import { Link } from 'react-router-dom';

function LoginForm() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.phones}>
        <img src={Phones} alt="Phones" />
      </div>
      <div className={styles.authForm}>
        <div className={styles.containerOne}>
          <img className={styles.logo} src={Logo} alt="LogoApp" />

          <form className={styles.form}>
            <div className={styles.inputField}>
              <input
                className={styles.input}
                type="text"
                placeholder="Username or email"
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Password"
              />
            </div>
            <button className={styles.button}>Log in</button>
            <div className={styles.or}>
              <div className={styles.line}></div>
              <span style={{ padding: '0 10px' }}>Or</span>
              <div className={styles.line}></div>
            </div>
            <Link
              className={styles.link}
              to='/reset'
            >
              Forgot password?
            </Link>
          </form>
        </div>
        <div className={styles.containerTwo}>
          <p className={styles.parTwo}>
            Don't have an account?{' '}
            <Link style={{ color: 'rgba(0, 149, 246, 1)' }} to='/register'>
              Sing up
            </Link>{' '}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

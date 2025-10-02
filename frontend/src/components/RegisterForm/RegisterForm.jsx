import React from 'react';
//import { useState } from 'react';
import styles from './RegisterForm.module.css';
import Logo from '../../assets/images/postswap.png';
import { Link } from 'react-router-dom';

function RegisterForm() {
  //     const [formData, setFormData] = useState({
  //     fullName: '',
  //     username: '',
  //     email: '',
  //     password: ''
  //   });
  return (
    <div className={styles.wrapper}>
      <div className={styles.containerOne}>
        <img className={styles.logo} src={Logo} alt="LogoApp" />
        <h3>Sign up to see photos and video from your friends.</h3>
        <form className={styles.form}>
          <div className={styles.inputField}>
            <input className={styles.input} type="text" placeholder="Email" />
            <input
              className={styles.input}
              type="text"
              placeholder="Full name"
            />
            <input
              className={styles.input}
              type="text"
              placeholder="UserName"
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Password"
            />
          </div>
          <div className={styles.parField}>
            <p className={styles.par}>
              People who use our service may have uploaded your contact
              information to Instagram. <a href="*">Learn More</a>
            </p>
            <p className={styles.par}>
              By signing up, you agree to our <a href="*">Terms</a>,{' '}
              <a href="*">Privacy</a>
              <a href="*">Policy</a> and <a href="*">Cookie Policy</a>
            </p>
          </div>

          <button className={styles.button}>Sing up</button>
        </form>
      </div>
      <div className={styles.containerTwo}>
        <p className={styles.parTwo}>
          Have an account? <Link style={{color: 'rgba(0, 149, 246, 1)'}} to='/login'>Log in</Link>{' '}
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;

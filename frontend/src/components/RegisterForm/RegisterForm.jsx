import React from 'react'
import { useState } from 'react';
import styles from './RegisterForm.module.css'
import Logo from '../../assets/images/postswap.png'

function RegisterForm() {
    const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });
  return (
    <div className={styles.wrapper}>
        <div className={styles.containerOne}>
        <img src={Logo} alt="LogoApp" />
        <h3>Sign up to see photos and video from your friends.</h3>
        <form action="">
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <p></p>
            <p></p>
        </form>
        </div>
        <div className={styles.conatainertwo}>
            <p></p>
            <a href=""></a>
        </div>
        

    </div>
  )
}

export default RegisterForm
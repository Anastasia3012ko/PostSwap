import React from 'react';
import ResetPasswordForm from '../../components/ResetPasswordForm/ResetPasswordForm';
import styles from './ResetPassword.module.css';
import Logo from '../../assets/images/postswap.png'
import ChangePassword from '../../components/changePassword/ChangePassword';


const ResetPassword = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
              <img  className={styles.logoIcon} src={Logo} alt="logo" />
            </div>
      <ResetPasswordForm />
      {/* <ChangePassword /> */}
    </div>
  );
};

export default ResetPassword;

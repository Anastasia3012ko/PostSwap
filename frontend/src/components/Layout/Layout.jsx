import React from 'react';
import styles from './Layout.module.css'
import SideBar from '../SideBar/SideBar';
import Footer from '../Footer/Footer';


const Layout = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      <SideBar />
      <div className={styles.mainContainer}>
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

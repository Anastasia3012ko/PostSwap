import React, { useState } from 'react';
import styles from './Layout.module.css'
import SideBar from '../SideBar/SideBar';
import Footer from '../Footer/Footer';


const Layout = ({ children }) => {
  const [activePanel, setActivePanel] = useState(null);
  return (
    <div className={styles.layoutContainer}>
      <SideBar activePanel={activePanel} setActivePanel={setActivePanel}/>
      <div className={styles.mainContainer}>
        <main className={styles.main}>{children}</main>
        <Footer setActivePanel={setActivePanel}/>
      </div>
    </div>
  );
};

export default Layout;

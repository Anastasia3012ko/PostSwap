import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './Layout.module.css'
import SideBar from '../SideBar/SideBar';
import Footer from '../Footer/Footer';


const Layout = ({ children }) => {
  const [activePanel, setActivePanel] = useState(null);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className={styles.layoutContainer}>
      {user && <SideBar activePanel={activePanel} setActivePanel={setActivePanel} />}
      <div className={styles.mainContainer}>
        <main className={styles.main}>{children}</main>
        {user && <Footer setActivePanel={setActivePanel} />}
      </div>
    </div>
  );
};

export default Layout;

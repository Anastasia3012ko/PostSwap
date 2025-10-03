import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './SideBar.module.css';
import Logo from '../../assets/images/postswap.png';
import Home from '../../assets/icons/home.svg';
import Search from '../../assets/icons/loop.svg';
import Explore from '../../assets/icons/explore.svg';
import Messages from '../../assets/icons/messenger.svg';
import Notifications from '../../assets/icons/notifications.svg';
import Create from '../../assets/icons/create.svg';
import X from '../../assets/icons/closeX.svg';
import { useSelector } from 'react-redux';

const SideBar = ({ activePanel, setActivePanel }) => {
  const [activeLink, setActiveLink] = useState(null); 
  const userId = useSelector(state => state.auth.user?._id);
  if (!userId) return null;

  const menuItems = [
    { name: 'Home', type: 'link', path: '/', icon: Home },
    { name: 'Search', type: 'panel', icon: Search },
    { name: 'Explore', type: 'link', path: '/explore', icon: Explore },
    { name: 'Message', type: 'link', path: '/chat', icon: Messages },
    { name: 'Notifications', type: 'panel', icon: Notifications },
    { name: 'Create', type: 'link', path: '/addPost', icon: Create },
  ];

  const handleClick = (item) => {
    if (item.type === 'panel') {
      setActivePanel(activePanel === item.name ? null : item.name);
      setActiveLink(null);
    } else {
      setActivePanel(null);
      setActiveLink(item.name);
    }
  };

  const closePanel = () => setActivePanel(null);

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${activePanel ? styles.active : ''}`}
        onClick={closePanel}
      ></div>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <img src={Logo} alt="logo" className={styles.logo} />
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.type === 'link' ? (
                  <NavLink
                    to={item.path}
                    className={() =>
                      activeLink === item.name ? styles.linkActive : styles.link
                    }
                    onClick={() => handleClick(item)}
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={styles.icon}
                    />
                    {item.name}
                  </NavLink>
                ) : (
                  <button
                    onClick={() => handleClick(item)}
                    className={
                      activePanel === item.name
                        ? styles.linkActive
                        : styles.link
                    }
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={styles.icon}
                    />
                    {item.name}
                  </button>
                )}
              </li>
            ))}
            
          </ul>
        </nav>
        <div className={styles.profile} onClick={handleClick}>
          <Link to={`/profile/${userId}`}>
            <img src="*" alt="FotoProfile" />
            <h4>Profile</h4>
          </Link>
        </div>
      </aside>

      {/* Active Panel */}
      {activePanel && (
        <aside className={`${styles.activePanel} ${styles.open}`}>
          <div className={styles.activeHeader}>
            <h2>{activePanel}</h2>
            <button onClick={closePanel}>
              <img src={X} alt="close" />
            </button>
          </div>

          <p>This is context...</p>
        </aside>
      )}
    </>
  );
};

export default SideBar;

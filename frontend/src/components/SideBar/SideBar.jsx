import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './SideBar.module.css';
import Logo from '../../assets/images/postswap.png';
import Home from '../../assets/icons/home.svg';
import Search from '../../assets/icons/loop.svg';
import Explore from '../../assets/icons/explore.svg';
import Messages from '../../assets/icons/messenger.svg';
import Notifications from '../../assets/icons/notifications.svg';
import Create from '../../assets/icons/create.svg';
import X from '../../assets/icons/closeX.svg';
import Avatar from '../Avatar/Avatar';
import SearchUser from '../SearchUser/SearchUser';
import CreatePostModal from '../CreatePostModal/CreatePostModal';

const SideBar = ({ activePanel, setActivePanel }) => {
  const [activeLink, setActiveLink] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const user = useSelector(state => state.auth.user);
  const userId = user?._id;
  const avatarUrl = user?.avatar?.url || null;

  if (!userId) return null;

  const menuItems = [
    { name: 'Home', type: 'link', path: '/', icon: Home },
    { name: 'Search', type: 'panel', icon: Search },
    { name: 'Explore', type: 'link', path: '/explore', icon: Explore },
    { name: 'Message', type: 'link', path: '/chat', icon: Messages },
    { name: 'Notifications', type: 'panel', icon: Notifications },
    { name: 'Create', type: 'modal', icon: Create }, // теперь Create типа modal
  ];

  const handleClick = (item) => {
    if (item.type === 'panel') {
      setActivePanel(activePanel === item.name ? null : item.name);
      setActiveLink(null);
    } else if (item.type === 'link') {
      setActivePanel(null);
      setActiveLink(item.name);
    } else if (item.type === 'modal' && item.name === 'Create') {
      setIsCreateModalOpen(true);
    }
  };

  const closePanel = () => setActivePanel(null);

  return (
    <>
      {/* Overlay для панели */}
      {activePanel && <div className={`${styles.overlay} ${styles.active}`} onClick={closePanel}></div>}

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
                    <img src={item.icon} alt={item.name} className={styles.icon} />
                    {item.name}
                  </NavLink>
                ) : (
                  <button
                    onClick={() => handleClick(item)}
                    className={activePanel === item.name ? styles.linkActive : styles.link}
                  >
                    <img src={item.icon} alt={item.name} className={styles.icon} />
                    {item.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.profile}>
          <Link className={styles.linkToProfile} to={`/profile/${userId}`}>
            {user.avatar && <Avatar src={avatarUrl} size={24} />}
            <p className={styles.userName}>{user?.userName || 'Profile'}</p>
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

          {activePanel === "Search" && <SearchUser />}
          {activePanel === "Notifications" && <p>Here will be notifications...</p>}
        </aside>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default SideBar;


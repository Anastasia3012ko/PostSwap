import React from 'react'
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
import Date from '../../assets/images/2025.png'

function Footer({ setActivePanel }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.links}>
        <Link className={styles.link} to='/'>Home</Link>
        <button className={styles.btn} onClick={() => setActivePanel("Search")}>Search</button>
        <Link className={styles.link} to='/explore'>Explore</Link>
        <Link className={styles.link} to='/chat'>Messages</Link>
        <button className={styles.btn}  onClick={() => setActivePanel("Notifications")}>Notifications</button>
        <Link className={styles.link} to='/create'>Create</Link>
        
      </div>
      <div className={styles.dateApp}>
        <img style={{width: '12px'}} src={Date} alt='2025' />
        <p style={{fontSize: '12px'}}>2025 PostSwap</p>
      </div>
    </div>
  )
}

export default Footer
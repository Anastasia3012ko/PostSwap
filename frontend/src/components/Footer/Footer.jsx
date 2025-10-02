import React from 'react'
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
import Date from '../../assets/images/2025.png'

function Footer() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.links}>
        <Link className={styles.link} to='/'>Home</Link>
        <Link className={styles.link} to='/search'>Search</Link>
        <Link className={styles.link} to='/explore'>Explore</Link>
        <Link className={styles.link} to='/chat'>Messages</Link>
        <Link className={styles.link} to='/notifications'>Notifications</Link>
        <Link className={styles.link} to='/create'>Create</Link>
        
      </div>
      <div className={styles.dateApp}>
        <img src={Date} alt='2025' />
        <p>2025 PostSwap</p>
      </div>
    </div>
  )
}

export default Footer
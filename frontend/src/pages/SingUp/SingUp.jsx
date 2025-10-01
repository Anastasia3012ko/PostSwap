import React from 'react'
import styles from './SingUp.module.css'
import RegisterForm from '../../components/RegisterForm/RegisterForm'

const SingUp = () => {
  return (
    <div className={styles.wrapper}>
        <RegisterForm />
    </div>
  )
}

export default SingUp
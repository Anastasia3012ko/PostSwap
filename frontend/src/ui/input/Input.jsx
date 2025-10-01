import React from 'react'
import styles from './input.module.css'

const Input = ({
  type = "text",
  value,
  onChange,
  placeholder 
}) => {
  return (
    <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
  )
}

export default Input
import React from 'react'

const ErrorMessage = ({error}) => {
    if (!error) return null;
  return (
    <p style={{ color: "red", fontSize: '12px', fontWeight: '500',  marginTop: "8px" }}>
      {error}
    </p>
  )
}

export default ErrorMessage


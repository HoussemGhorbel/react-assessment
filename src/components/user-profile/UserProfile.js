import React from 'react'
import { Link, useParams } from 'react-router-dom'

import './style.css'

const UserProfile = () => {
  const { authorId } = useParams()

  return (
    <div className="userProfile">
      <Link to="/">Home</Link> / author / {authorId}
    </div>
  )
}

export default UserProfile

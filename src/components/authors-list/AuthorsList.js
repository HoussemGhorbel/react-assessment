import React from 'react'
import { useHistory } from 'react-router-dom'

import './style.css'

const AuthorsList = ({ authors = {} }) => {
  const history = useHistory()
  return (
    <div className="authorsList">
      {Object.entries(authors).map(([id, { avatar, firstName, lastName, email }]) => (
        <div onClick={() => history.push(`/author/${id}`)} className="authorsList__item" key={id}>
          <img className="item__img" src={avatar} alt={`${firstName} ${lastName}`} />
          <div className="item__text">
            <div className="item__primaryText">
              {firstName}
              {lastName}
            </div>
            <div className="item__secondaryText">{email}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AuthorsList

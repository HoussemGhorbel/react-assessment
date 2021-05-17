import React, { useState } from 'react'

import './style.css'

const TopTopics = ({ topics }) => {
  const [showAll, setShowAll] = useState(false)
  return (
    <div className="topTopics">
      {topics?.slice(0, showAll ? undefined : 3).map(({ label, likelihood }, index) => (
        <div className="topTopics__item" key={label}>
          <div>
            {index + 1}. {label}
          </div>
          <div> ({(likelihood * 100).toFixed(2)}%)</div>
        </div>
      ))}
      {topics?.length > 3 && (
        <button className="topTopics__button" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Top 3' : 'Show All'}
        </button>
      )}
    </div>
  )
}

export default TopTopics

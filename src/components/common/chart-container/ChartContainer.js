import React from 'react'
import PropTypes from 'prop-types'

import './style.css'

const ChartContainer = ({ title, isTextContent, children }) => (
  <div className="chartContainer">
    <div className="chartContainer__title">{title}</div>
    <div
      className={`chartContainer__chart ${
        isTextContent ? 'chartContainer__chart--textContent' : ''
      }`}
    >
      {children}
    </div>
  </div>
)

export default ChartContainer

ChartContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
}

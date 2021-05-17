import React from 'react'
import Pie from '@visx/shape/lib/shapes/Pie'
import { scaleOrdinal } from '@visx/scale'
import { Group } from '@visx/group'
import { animated, useTransition, interpolate } from 'react-spring'
import { schemeCategory10 } from 'd3-scale-chromatic'

// accessor functions
const frequency = (d) => d.likelihood

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 }

export default function PieChart({ width, height, margin = defaultMargin, animate = true, data }) {
  const getLetterFrequencyColor = scaleOrdinal({
    domain: data.map((l) => l.label),
    range: schemeCategory10,
  })

  if (width < 10) return null

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const radius = Math.min(innerWidth, innerHeight) / 2
  const centerY = innerHeight / 2
  const centerX = innerWidth / 2
  const donutThickness = 5

  return (
    <svg width={width} height={height}>
      <rect rx={14} width={width} height={height} fill="#ffffff00" />
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={data}
          pieValue={frequency}
          pieSortValues={() => -1}
          outerRadius={radius - donutThickness * 1.3}
        >
          {(pie) => (
            <AnimatedPie
              {...pie}
              animate={animate}
              getKey={({ data: { label } }) => label}
              onClickDatum={() => null}
              getColor={({ data: { label } }) => getLetterFrequencyColor(label)}
            />
          )}
        </Pie>
      </Group>
    </svg>
  )
}

const fromLeaveTransition = ({ endAngle }) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
})
const enterUpdateTransition = ({ startAngle, endAngle }) => ({
  startAngle,
  endAngle,
  opacity: 1,
})

function AnimatedPie({ animate, arcs, path, getKey, getColor, onClickDatum }) {
  const transitions = useTransition(
    arcs,
    getKey,
    // @ts-ignore react-spring doesn't like this overload
    {
      from: animate ? fromLeaveTransition : enterUpdateTransition,
      enter: enterUpdateTransition,
      update: enterUpdateTransition,
      leave: animate ? fromLeaveTransition : enterUpdateTransition,
    }
  )
  return (
    <>
      {transitions.map(({ item: arc, props, key }) => {
        const [centroidX, centroidY] = path.centroid(arc)
        const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1

        return (
          <g key={key}>
            <animated.path
              // compute interpolated path d attribute from intermediate angle values
              d={interpolate([props.startAngle, props.endAngle], (startAngle, endAngle) =>
                path({
                  ...arc,
                  startAngle,
                  endAngle,
                })
              )}
              fill={getColor(arc)}
              onClick={() => onClickDatum(arc)}
              onTouchStart={() => onClickDatum(arc)}
            />
            {hasSpaceForLabel && (
              <animated.g style={{ opacity: props.opacity }}>
                <text
                  fill="white"
                  x={centroidX}
                  y={centroidY}
                  dy=".33em"
                  fontSize={9}
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {getKey(arc)}
                </text>
              </animated.g>
            )}
          </g>
        )
      })}
    </>
  )
}

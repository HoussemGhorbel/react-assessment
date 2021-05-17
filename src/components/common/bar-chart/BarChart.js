import React, { useMemo } from 'react'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip'
import { localPoint } from '@visx/event'

const verticalMargin = 120

// accessors
const margins = {
  left: 30,
}
let tooltipTimeout

const BarChart = ({ width, height, onClick = () => null, data }) => {
  // bounds
  const xMax = width - margins.left
  const yMax = height - verticalMargin

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xMax],
        round: true,
        domain: data.map(([{ value }]) => value),
        padding: 0.4,
      }),
    [xMax, data]
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(([, { value }]) => value))],
      }),
    [yMax, data]
  )
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
    useTooltip()
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
    scroll: true,
  })
  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
  }
  return width < 10 ? null : (
    <>
      <svg width={width} height={height} ref={containerRef}>
        <rect width={width} height={height} fill="#ffffff00" rx={14} />
        <Group top={verticalMargin / 2} left={margins.left}>
          {data.map((item) => {
            const letter = item?.[0]?.value
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - (yScale(item?.[1]?.value) ?? 0)
            const barX = xScale(letter)
            const barY = yMax - barHeight
            return (
              <Bar
                style={{ cursor: 'pointer' }}
                key={`bar-${letter}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="#a2a2a2"
                onClick={() => onClick(item)}
                onMouseLeave={() => {
                  tooltipTimeout = window.setTimeout(() => {
                    hideTooltip()
                  }, 300)
                }}
                onMouseMove={(event) => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout)
                  // TooltipInPortal expects coordinates to be relative to containerRef
                  // localPoint returns coordinates relative to the nearest SVG, which
                  // is what containerRef is set to in this example.
                  const eventSvgCoords = localPoint(event)
                  const left = barX + barWidth / 2
                  showTooltip({
                    tooltipData: item,
                    tooltipTop: eventSvgCoords?.y,
                    tooltipLeft: left,
                  })
                }}
              />
            )
          })}
          <AxisBottom
            numTicks={data.length}
            top={yMax}
            scale={xScale}
            tickLabelProps={() => ({
              fill: '#000000',
              fontSize: 11,
              textAnchor: 'middle',
            })}
          />
          <AxisLeft
            scale={yScale.nice()}
            numTicks={10}
            top={0}
            tickLabelProps={(e) => ({
              fill: '#000000',
              fontSize: 10,
              textAnchor: 'end',
              x: -12,
              y: (yScale(e) ?? 0) + 3,
            })}
          />
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <strong>{tooltipData?.[0]?.value}</strong>
          </div>
          <div>
            {tooltipData?.[1]?.value} {tooltipData?.[1]?.unit}s
          </div>
        </TooltipInPortal>
      )}
    </>
  )
}

export default BarChart

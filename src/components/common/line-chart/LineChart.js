import React from 'react'
import {
  Axis, // any of these can be non-animated equivalents
  Grid,
  LineSeries,
  XYChart,
  Tooltip,
} from '@visx/xychart'

const accessors = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
}

const LineChart = ({ height, data, unit = '' }) => (
  <XYChart height={height} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
    <Axis orientation="bottom" />
    <Grid columns={false} />
    {data.map(({ title, values }) => (
      <LineSeries key={title} dataKey={title} data={values} {...accessors} />
    ))}

    <Tooltip
      snapTooltipToDatumX
      snapTooltipToDatumY
      showVerticalCrosshair
      showSeriesGlyphs
      renderTooltip={({ tooltipData, colorScale }) => (
        <div>
          <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
            {tooltipData.nearestDatum.key}
          </div>
          {accessors.xAccessor(tooltipData.nearestDatum.datum)}
          {', '}
          {accessors.yAccessor(tooltipData.nearestDatum.datum)}
          {unit}
        </div>
      )}
    />
  </XYChart>
)

export default LineChart

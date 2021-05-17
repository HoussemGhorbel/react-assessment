import React, { useState } from 'react'
import ParentSize from '@visx/responsive/lib/components/ParentSize'

import BarChart from 'components/common/bar-chart'
import ChartContainer from 'components/common/chart-container'
import LineChart from 'components/common/line-chart/LineChart'
import TopTopics from 'components/top-topics'
import AuthorsList from 'components/authors-list'

import { postsLikelyTopics } from 'utils/postsUtils'

import './style.css'

const Home = ({ allPostsByMonths, trends, authors, months, selectedYear }) => {
  const [selectedMonth, setSelectedMonth] = useState(months[0])

  const topPrevalent = postsLikelyTopics(allPostsByMonths[months.indexOf(selectedMonth)])

  return (
    <div className="home">
      <div className="home__row">
        <ChartContainer title={`All Posts by ${selectedYear} Months`}>
          <ParentSize>
            {({ width, height }) => (
              <BarChart
                width={width}
                height={height}
                data={allPostsByMonths.map((month, index) => [
                  { unit: 'month', value: months[index] },
                  { unit: 'post', value: month.length },
                ])}
                onClick={(item) => setSelectedMonth(item?.[0]?.value)}
              />
            )}
          </ParentSize>
        </ChartContainer>
        <ChartContainer
          isTextContent
          title={`Top prevalent Topics for ${selectedMonth}. ${selectedYear}`}
        >
          <TopTopics topics={topPrevalent} />
        </ChartContainer>
      </div>
      <div className="home__row">
        <ChartContainer title={`Trending Topics in ${selectedYear}`}>
          <ParentSize>
            {({ width, height }) => (
              <LineChart
                width={width}
                height={height}
                data={Object.entries(trends).map(([title, values]) => ({
                  unit: 'topic',
                  title,
                  values,
                }))}
                unit="%"
              />
            )}
          </ParentSize>
        </ChartContainer>
        <ChartContainer isTextContent title="Authors">
          <AuthorsList authors={authors} />
        </ChartContainer>
      </div>
    </div>
  )
}

export default Home

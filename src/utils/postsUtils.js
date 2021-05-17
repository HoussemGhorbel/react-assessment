import Info from 'luxon/src/info'
import DateTime from 'luxon/src/datetime'

export const postsByMonths = (posts, year) => {
  const months = Info.months()
  const byMonths = months.map(() => [])
  posts?.forEach((post) => {
    const date = DateTime.fromMillis(+post?.createdAt)
    if (date.year === year) {
      byMonths[date.month - 1].push(post)
    }
  })
  return byMonths
}

export const postsLikelyTopics = (posts) => {
  const topics = {}
  posts?.forEach(({ likelyTopics }) => {
    likelyTopics.forEach(({ label, likelihood }) => {
      topics[label] = topics[label] ? topics[label] + likelihood : likelihood
    })
  })
  return Object.entries(topics)
    .map(([key, value]) => ({ label: key, likelihood: value / posts.length }))
    .sort((a, b) => b.likelihood - a.likelihood)
}

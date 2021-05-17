# App Description

Please use pnpm instead of yarn, e.g.:

```bash
pnpm install && pnpm start
```

## Process

I started with configuring the boilerplate and including main libraries:

1. `Graphql` and `apollo/client` for the API
2. `luxon` for the datetime (since it's the best alternative for momentjs)
3. `react-router-dom` for pages routing
4. `eslint` and `prettier` for code quality

Then the necessary `visx` libraries for charts and graphs

## Design choices

I separated the visualizations into 2 pages:

1. `Home page`: Global details about all posts in our fictitious blog
2. `User Profile` (by AuthorId): Author details

## Challenges

Learn `visx` basics and how it works: For now i just copied their examples and make them work with our needs, but they still much more features that we can add like more legends and accurate yAxis

## Suggestions

1. It seems there is a problem with `Amazon s3`: Users avatars are returning `access denied` message
2. It's not clear if API's data is only for 2019 or can return posts in 2020

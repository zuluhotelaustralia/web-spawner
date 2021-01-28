import { useLocation, useHistory } from 'react-router-dom'
import qs from 'query-string'

function filterAllowedParams(queries: any, allowedParams: any) {
  return allowedParams.reduce((acc: any, param: any) => {
    if (Object.prototype.hasOwnProperty.call(queries, param)) {
      acc[param] = queries[param]
    }
    return acc
  }, {})
}

interface Config {
  allowedParams: string[]
}

interface Queries {
  [key: string]: string | number
}

export default function useUrlQueries({ allowedParams }: Config) {
  const location = useLocation()
  const history = useHistory()
  const params = filterAllowedParams(qs.parse(location.search), allowedParams)

  const updateQueries = (queries: Queries) => {
    const allowedQueriesParams = filterAllowedParams(queries, allowedParams)
    const newQueryString = qs.stringify({
      ...qs.parse(location.search),
      ...allowedQueriesParams,
    })
    history.push(
      `${location.pathname}${newQueryString ? `?${newQueryString}` : ''}`,
    )
  }

  return {
    params,
    updateQueries,
  }
}

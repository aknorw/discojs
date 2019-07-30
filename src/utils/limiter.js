import Bottleneck from 'bottleneck'

export default ({ concurrency = 1, maxRequests, requestLimitInterval }) =>
  new Bottleneck({
    maxConcurrent: concurrency,
    minTime: requestLimitInterval / maxRequests,
    reservoir: maxRequests,
    reservoirRefreshAmount: maxRequests,
    reservoirRefreshInterval: requestLimitInterval,
  })

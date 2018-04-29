import Bottleneck from 'bottleneck'

export default ({ concurrency = 1, waitTime } = {}) => new Bottleneck({
  maxConcurrent: concurrency,
  minTime: waitTime,
})

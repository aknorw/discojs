/* eslint-disable no-param-reassign */

export default (obj, cl) =>
  Object.keys(obj).forEach((o) => {
    cl.prototype[o] = obj[o]
  })

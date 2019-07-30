import dotenv from 'dotenv'

import Discojs from '../src'

dotenv.config()

global.client = new Discojs({
  userToken: process.env.USER_TOKEN,
  requestLimitAuth: 40,
})

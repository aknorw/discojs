const { Discojs } = require('./lib')

const client = new Discojs()

async function main() {
  const test = await client.getRelease(9175066)
  console.log(test.series)
}

main()

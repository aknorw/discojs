export default function getIdentity() {
  return this._fetch({ uri: '/oauth/identity' })
}

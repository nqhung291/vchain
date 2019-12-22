const TokenKey = 'JWTToken'
const NameKey = 'Name'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function getName() {
  return sessionStorage.getItem(NameKey)
}

export function setName(name) {
  return sessionStorage.setItem(NameKey, name)
}

export function removeName() {
  return sessionStorage.removeItem(NameKey)
}

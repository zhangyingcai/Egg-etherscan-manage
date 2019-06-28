import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const IdKey = 'vue_admin_template_id'

export function getId() {
  return localStorage.getItem(IdKey)
}

export function setId(id) {
  return localStorage.setItem(IdKey, id)
}

export function removeId() {
  return localStorage.removeItem(IdKey)
}

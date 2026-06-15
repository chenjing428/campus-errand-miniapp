/**
 * 登录状态管理
 */

const TOKEN_KEY = 'campus_errand_token'
const USER_KEY = 'campus_errand_user'

export function setToken(token) {
	uni.setStorageSync(TOKEN_KEY, token)
}

export function getToken() {
	return uni.getStorageSync(TOKEN_KEY) || ''
}

export function removeToken() {
	uni.removeStorageSync(TOKEN_KEY)
}

export function setUserInfo(user) {
	uni.setStorageSync(USER_KEY, user)
}

export function getUserInfo() {
	return uni.getStorageSync(USER_KEY) || null
}

export function removeUserInfo() {
	uni.removeStorageSync(USER_KEY)
}

export function isLoggedIn() {
	return !!getToken()
}

export function logout() {
	removeToken()
	removeUserInfo()
}

/**
 * 检查登录状态，未登录跳登录页
 */
export function checkLogin(redirect = true) {
	if (!isLoggedIn()) {
		if (redirect) {
			uni.redirectTo({
				url: '/pages/login/login'
			})
		}
		return false
	}
	return true
}

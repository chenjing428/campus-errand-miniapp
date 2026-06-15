/**
 * 云函数调用封装
 */

import { getToken } from './auth.js'

const CLOUD_FUNCTION_PREFIX = 'campus-errand-'

/**
 * 调用云函数
 * @param {string} name 云函数名（不含前缀）
 * @param {object} data 参数
 * @returns {Promise<object>}
 */
export function callFunction(name, data = {}) {
	return new Promise((resolve, reject) => {
		// 自动附带 token
		const token = getToken()
		const params = {
			...data,
			token
		}

		uniCloud.callFunction({
			name: `${CLOUD_FUNCTION_PREFIX}${name}`,
			data: params,
			success: (res) => {
				const result = res.result
				if (result && result.code !== undefined && result.code !== 0) {
					reject(new Error(result.message || '请求失败'))
				} else {
					resolve(result)
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

/**
 * 统一错误处理
 */
export function showError(err) {
	uni.showToast({
		title: err.message || '操作失败',
		icon: 'none'
	})
}

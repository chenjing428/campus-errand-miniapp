const utils = require('campus-errand-utils')

exports.main = async (event, context) => {
	const { token } = event

	try {
		const user = await utils.getUserByToken(token)
		if (!user) {
			return utils.error('登录已过期，请重新登录', 401)
		}

		return utils.success({
			userInfo: utils.formatUserInfo(user)
		})
	} catch (err) {
		console.error('获取用户信息异常', err)
		return utils.error(err.message || '获取用户信息失败')
	}
}

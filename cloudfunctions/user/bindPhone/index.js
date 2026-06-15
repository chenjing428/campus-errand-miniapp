const utils = require('campus-errand-utils')

exports.main = async (event, context) => {
	const { token, encryptedData, iv } = event

	if (!encryptedData || !iv) {
		return utils.error('缺少手机号加密数据')
	}

	try {
		const user = await utils.getUserByToken(token)
		if (!user) {
			return utils.error('登录已过期，请重新登录', 401)
		}

		if (!user.sessionKey) {
			return utils.error('sessionKey 不存在，请重新登录')
		}

		const phoneData = utils.decryptWxData(user.sessionKey, encryptedData, iv)
		if (!phoneData.phoneNumber) {
			return utils.error('解密手机号失败')
		}

		const db = uniCloud.database()
		await db.collection('users').doc(user._id).update({
			phone: phoneData.phoneNumber,
			updatedAt: Date.now()
		})

		const updatedUser = await db.collection('users').doc(user._id).get()

		return utils.success({
			userInfo: utils.formatUserInfo(updatedUser.data[0])
		})
	} catch (err) {
		console.error('绑定手机号异常', err)
		return utils.error(err.message || '绑定手机号失败')
	}
}

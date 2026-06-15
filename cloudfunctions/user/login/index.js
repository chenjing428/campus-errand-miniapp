const utils = require('campus-errand-utils')

exports.main = async (event, context) => {
	const { code, encryptedData, iv } = event
	const { appid, secret } = __config

	if (!code) {
		return utils.error('缺少登录 code')
	}

	try {
		// 1. 调用微信接口获取 openid 和 session_key
		const sessionRes = await utils.getWxSession(code, appid, secret)
		if (sessionRes.errcode) {
			return utils.error(`微信登录失败: ${sessionRes.errmsg}`)
		}

		const { openid, session_key, unionid } = sessionRes

		// 2. 查询或创建用户
		const db = uniCloud.database()
		const userCollection = db.collection('users')
		const userRes = await userCollection.where({ openid }).limit(1).get()

		let userInfo
		let isNewUser = false

		if (userRes.data && userRes.data.length > 0) {
			userInfo = userRes.data[0]
		} else {
			isNewUser = true
			const createRes = await userCollection.add({
				openid,
				unionid: unionid || '',
				sessionKey: session_key,
				nickname: '',
				avatar: '',
				phone: '',
				realName: '',
				studentId: '',
				school: '',
				role: 'user',
				riderStatus: 'none',
				balance: 0,
				creditScore: 100,
				createdAt: Date.now(),
				updatedAt: Date.now()
			})
			userInfo = {
				_id: createRes.id,
				openid,
				unionid: unionid || '',
				nickname: '',
				avatar: '',
				phone: '',
				realName: '',
				studentId: '',
				school: '',
				role: 'user',
				riderStatus: 'none',
				balance: 0,
				creditScore: 100
			}
		}

		// 3. 如果有手机号加密数据，解密并绑定
		if (encryptedData && iv && session_key) {
			try {
				const phoneData = utils.decryptWxData(session_key, encryptedData, iv)
				if (phoneData.phoneNumber) {
					userInfo.phone = phoneData.phoneNumber
					await userCollection.doc(userInfo._id).update({
						phone: phoneData.phoneNumber,
						updatedAt: Date.now()
					})
				}
			} catch (e) {
				console.error('解密手机号失败', e)
			}
		}

		// 4. 更新 session_key 和 token
		const token = utils.createToken()
		const tokenExpire = utils.getTokenExpire()
		await userCollection.doc(userInfo._id).update({
			sessionKey: session_key,
			token,
			tokenExpire,
			updatedAt: Date.now()
		})

		return utils.success({
			token,
			isNewUser,
			userInfo: utils.formatUserInfo({
				...userInfo,
				token,
				tokenExpire
			})
		})
	} catch (err) {
		console.error('登录异常', err)
		return utils.error(err.message || '登录失败')
	}
}

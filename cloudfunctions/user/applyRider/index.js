const utils = require('campus-errand-utils')

exports.main = async (event, context) => {
	const { token, certImage, remark } = event

	if (!certImage) {
		return utils.error('请上传学生证照片')
	}

	try {
		const user = await utils.getUserByToken(token)
		if (!user) {
			return utils.error('登录已过期，请重新登录', 401)
		}

		if (!user.phone || !user.studentId) {
			return utils.error('请先绑定手机号和学号')
		}

		if (user.riderStatus === 'pending') {
			return utils.error('您已提交申请，请勿重复提交')
		}

		if (user.riderStatus === 'approved') {
			return utils.error('您已经是认证骑手')
		}

		const db = uniCloud.database()

		// 创建申请记录
		await db.collection('rider_applications').add({
			userId: user._id,
			openId: user.openid,
			realName: user.realName,
			studentId: user.studentId,
			school: user.school,
			phone: user.phone,
			certImage,
			remark: remark || '',
			status: 'pending',
			createdAt: Date.now(),
			updatedAt: Date.now()
		})

		// 更新用户状态
		await db.collection('users').doc(user._id).update({
			riderStatus: 'pending',
			updatedAt: Date.now()
		})

		const updatedUser = await db.collection('users').doc(user._id).get()

		return utils.success({
			userInfo: utils.formatUserInfo(updatedUser.data[0])
		})
	} catch (err) {
		console.error('申请骑手异常', err)
		return utils.error(err.message || '申请失败')
	}
}

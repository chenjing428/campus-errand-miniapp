const utils = require('campus-errand-utils')

exports.main = async (event, context) => {
	const { token, realName, studentId, school, nickname, avatar } = event

	try {
		const user = await utils.getUserByToken(token)
		if (!user) {
			return utils.error('登录已过期，请重新登录', 401)
		}

		const updateData = { updatedAt: Date.now() }
		if (realName !== undefined) updateData.realName = realName.trim()
		if (studentId !== undefined) updateData.studentId = studentId.trim()
		if (school !== undefined) updateData.school = school.trim()
		if (nickname !== undefined) updateData.nickname = nickname.trim()
		if (avatar !== undefined) updateData.avatar = avatar.trim()

		const db = uniCloud.database()
		await db.collection('users').doc(user._id).update(updateData)

		const updatedUser = await db.collection('users').doc(user._id).get()

		return utils.success({
			userInfo: utils.formatUserInfo(updatedUser.data[0])
		})
	} catch (err) {
		console.error('更新资料异常', err)
		return utils.error(err.message || '更新资料失败')
	}
}

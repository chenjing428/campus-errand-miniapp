const utils = require('campus-errand-utils')

exports.main = async (event, context) => {
	const { token, applicationId, status, reason } = event

	if (!applicationId || !['approved', 'rejected'].includes(status)) {
		return utils.error('参数错误')
	}

	try {
		const admin = await utils.getUserByToken(token)
		if (!admin) {
			return utils.error('登录已过期，请重新登录', 401)
		}

		if (admin.role !== 'admin') {
			return utils.error('无权操作', 403)
		}

		const db = uniCloud.database()

		// 查询申请记录
		const appRes = await db.collection('rider_applications').doc(applicationId).get()
		if (!appRes.data || appRes.data.length === 0) {
			return utils.error('申请记录不存在')
		}

		const application = appRes.data[0]
		if (application.status !== 'pending') {
			return utils.error('该申请已处理')
		}

		// 更新申请记录
		await db.collection('rider_applications').doc(applicationId).update({
			status,
			reason: reason || '',
			auditorId: admin._id,
			updatedAt: Date.now()
		})

		// 更新用户角色
		const userUpdate = {
			riderStatus: status,
			updatedAt: Date.now()
		}
		if (status === 'approved') {
			userUpdate.role = 'rider'
		}

		await db.collection('users').doc(application.userId).update(userUpdate)

		return utils.success({ message: '审核完成' })
	} catch (err) {
		console.error('审核骑手异常', err)
		return utils.error(err.message || '审核失败')
	}
}

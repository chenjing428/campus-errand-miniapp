<template>
	<view class="container">
		<view class="card">
			<text class="section-title">完善校园信息</text>

			<view class="form-item">
				<text class="label">真实姓名</text>
				<input class="input" v-model="form.realName" placeholder="请输入真实姓名" />
			</view>

			<view class="form-item">
				<text class="label">学号</text>
				<input class="input" v-model="form.studentId" placeholder="请输入学号" />
			</view>

			<view class="form-item">
				<text class="label">学校</text>
				<input class="input" v-model="form.school" placeholder="请输入学校名称" />
			</view>

			<button class="btn-primary" @click="handleSubmit" :loading="loading">保存</button>
		</view>
	</view>
</template>

<script>
import { callFunction, showError } from '@/utils/request.js'
import { setUserInfo } from '@/utils/auth.js'

export default {
	data() {
		return {
			loading: false,
			form: {
				realName: '',
				studentId: '',
				school: ''
			}
		}
	},
	methods: {
		validate() {
			if (!this.form.realName.trim()) return '请输入真实姓名'
			if (!this.form.studentId.trim()) return '请输入学号'
			if (!this.form.school.trim()) return '请输入学校名称'
			return ''
		},

		async handleSubmit() {
			const error = this.validate()
			if (error) {
				uni.showToast({ title: error, icon: 'none' })
				return
			}

			this.loading = true
			try {
				const result = await callFunction('updateProfile', this.form)
				setUserInfo(result.userInfo)
				uni.showToast({ title: '保存成功', icon: 'success' })
				setTimeout(() => {
					uni.switchTab({ url: '/pages/profile/profile' })
				}, 1000)
			} catch (err) {
				showError(err)
			} finally {
				this.loading = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.section-title {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 40rpx;
}

.form-item {
	margin-bottom: 30rpx;
}

.label {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 12rpx;
}

.input {
	height: 80rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
}
</style>

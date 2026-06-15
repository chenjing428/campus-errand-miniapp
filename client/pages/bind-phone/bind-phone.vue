<template>
	<view class="container">
		<view class="card">
			<text class="tip">请绑定手机号，方便骑手/发单者联系您</text>
			<button
				class="btn-primary"
				open-type="getPhoneNumber"
				@getphonenumber="handleBindPhone"
				:loading="loading"
			>
				绑定手机号
			</button>
		</view>
	</view>
</template>

<script>
import { callFunction, showError } from '@/utils/request.js'
import { setUserInfo } from '@/utils/auth.js'

export default {
	data() {
		return {
			loading: false
		}
	},
	methods: {
		async handleBindPhone(e) {
			if (e.detail.errMsg !== 'getPhoneNumber:ok') {
				uni.showToast({ title: '绑定手机号失败', icon: 'none' })
				return
			}

			this.loading = true
			try {
				const result = await callFunction('bindPhone', {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv
				})
				setUserInfo(result.userInfo)

				uni.showToast({ title: '绑定成功', icon: 'success' })
				setTimeout(() => {
					if (!result.userInfo.studentId) {
						uni.redirectTo({ url: '/pages/bind-student/bind-student' })
					} else {
						uni.switchTab({ url: '/pages/profile/profile' })
					}
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
.tip {
	display: block;
	font-size: 28rpx;
	color: #666;
	margin-bottom: 40rpx;
	line-height: 1.6;
}
</style>

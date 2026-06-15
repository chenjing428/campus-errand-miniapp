<template>
	<view class="container">
		<view class="card">
			<text class="section-title">申请认证骑手</text>
			<text class="tip">认证骑手可接高价值订单。请上传学生证照片，审核通过后即可接单。</text>

			<view class="form-item">
				<text class="label">学生证照片</text>
				<view class="upload-box" @click="chooseImage">
					<image v-if="imageUrl" class="preview" :src="imageUrl" mode="aspectFit"></image>
					<text v-else class="upload-text">+ 点击上传</text>
				</view>
			</view>

			<view class="form-item">
				<text class="label">备注说明</text>
				<textarea class="textarea" v-model="remark" placeholder="可选：补充说明" />
			</view>

			<button class="btn-primary" @click="handleSubmit" :loading="loading" :disabled="applied">提交申请</button>
		</view>
	</view>
</template>

<script>
import { callFunction, showError } from '@/utils/request.js'
import { getUserInfo, setUserInfo } from '@/utils/auth.js'

export default {
	data() {
		return {
			loading: false,
			imageUrl: '',
			remark: '',
			applied: false
		}
	},
	onLoad() {
		const userInfo = getUserInfo() || {}
		if (userInfo.riderStatus === 'pending') {
			this.applied = true
			uni.showToast({ title: '您已提交申请，请耐心等待审核', icon: 'none', duration: 2000 })
		}
		if (userInfo.riderStatus === 'approved') {
			this.applied = true
			uni.showToast({ title: '您已是认证骑手', icon: 'success' })
		}
	},
	methods: {
		chooseImage() {
			if (this.applied) return
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.imageUrl = res.tempFilePaths[0]
				}
			})
		},

		async uploadImage() {
			if (!this.imageUrl) return ''
			return new Promise((resolve, reject) => {
				uniCloud.uploadFile({
					filePath: this.imageUrl,
					cloudPath: `rider-cert/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
					success: (res) => {
						resolve(res.fileID)
					},
					fail: reject
				})
			})
		},

		async handleSubmit() {
			if (this.applied) return
			if (!this.imageUrl) {
				uni.showToast({ title: '请上传学生证照片', icon: 'none' })
				return
			}

			this.loading = true
			try {
				const fileID = await this.uploadImage()
				const result = await callFunction('applyRider', {
					certImage: fileID,
					remark: this.remark
				})
				setUserInfo(result.userInfo)
				uni.showToast({ title: '提交成功', icon: 'success' })
				setTimeout(() => {
					uni.navigateBack()
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
	margin-bottom: 20rpx;
}

.tip {
	display: block;
	font-size: 26rpx;
	color: #999;
	margin-bottom: 40rpx;
	line-height: 1.5;
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

.upload-box {
	width: 240rpx;
	height: 240rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.upload-text {
	font-size: 60rpx;
	color: #ccc;
}

.preview {
	width: 100%;
	height: 100%;
}

.textarea {
	width: 100%;
	height: 160rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}
</style>

<template>
  <div class="login">
    <van-nav-bar
    title="会员登录"
    left-arrow
    @click-left="$router.go(-1)"
    />

    <div class="content">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" type="text" maxlength="11" placeholder="请输入手机号码">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" type="text" maxlength="5" placeholder="请输入图形验证码">
          <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="">
        </div>
        <div class="form-item">
          <input v-model="smsCode" class="inp" type="text" placeholder="请输入短信验证码">
          <button @click="getCode">
            {{second===totalSecond? '获取验证码':second+'秒后重新发送'}}
          </button>
        </div>
      </div>

      <div @click="login" class="login-btn">登录</div>
    </div>
  </div>
</template>

<script>
import { getMsgCode, getPicCode, login } from '@/api/login'
export default {
  name: 'LoginIndex',
  data () {
    return {
      picCode: '',
      picKey: '',
      picUrl: '',
      totalSecond: 60,
      second: 60,
      timer: null,
      mobile: '',
      smsCode: ''
    }
  },
  created () {
    this.getPicCode()
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    async getPicCode () {
      const { data: { base64, key } } = await getPicCode()
      this.picKey = key
      this.picUrl = base64
    },
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('请输入正确的图形验证码')
        return false
      }
      return true
    },
    async getCode () {
      if (!this.validFn()) {
        return
      }
      if (!this.timer && this.second === this.totalSecond) {
        await getMsgCode(this.picCode, this.picKey, this.mobile)
        this.$toast('短信发送成功，注意查收')

        this.timer = setInterval(() => {
          this.second--

          if (this.second <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.second = this.totalSecond
          }
        }, 1000)
      }
    },
    async login () {
      if (!this.validFn()) {
        return
      }

      if (!/^\d{6}$/.test(this.smsCode)) {
        this.$toast('请输入正确的收集验证码')
        return
      }

      const res = await login(this.smsCode, this.mobile)
      this.$store.commit('user/setUserInfo', res.data)
      this.$toast('登录成功')
      const url = this.$route.query.backUrl || '/'
      this.$router.replace(url)
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding:49px 29px;

  .title {
    margin-bottom:20px;
    h3{
      font-size: 30px;
      font-weight: normal;
    }
    p{
      font-size: 15px;
      color: gray;
    }
  }

  .form{
    .form-item{
      border-bottom: 1px solid gray;
      padding:8px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      .inp{
        display: block;
        border:none;
        outline: none;
        height: 32px;
        font-size: 14px;
        flex:1;
      }
      img{
        height: 32px;
        width: 94px;
      }
      button{
        height: 32px;
        border:none;
        font-size: 14px;
        color: #cea26a;
        background-color: transparent;
        padding-right: 9px;
      }
    }
  }

  .login-btn{
    width: 100%;
    height: 42px;
    margin-top: 40px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    border-radius: 40px;
    color:#fff;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

<template>
  <div class="pay">
    <van-nav-bar fixed title="订单结算台" left-arrow @click-left="$router.go(-1)" />
    <div class="address">
      <div class="left-icon">
        <van-icon name="logistics" />
      </div>
      <div class="info" v-if="addressList.length>0">
        <div class="user">
          <span>{{selectedAddress.name}}</span>
          <span>{{selectedAddress.phone}}</span>
        </div>
        <div class="info-address">
          {{longAddress}}
        </div>
      </div>
      <div class="info" v-else>
        请选择配送地址
      </div>
      <div class="right-icon">
        <van-icon name="arrow" />
      </div>
    </div>

    <div class="goods" v-for="item in order.goodsList" :key="item.goods_id">
      <div class="left">
        <img :src="item.goods_image" alt="">
      </div>
      <div class="right">
        <p class="goods-name">
          {{item.goods_name}}
        </p>
        <p class="info">
          <span class="num">x{{item.total_num}}</span>
          <span class="price">￥{{item.total_pay_price}}</span>
        </p>
      </div>
    </div>
    <div class="total">
      <span>共{{order.orderTotalNum}}件商品，合计： </span>
      <span class="price">￥{{order.orderTotalPrice}}</span>
    </div>
    <div class="pay-list">
      <div class="total-price">
        <span>订单总金额</span>
        <span class="price">￥{{order.orderTotalPrice}}</span>
      </div>
      <div class="pay-cell">
          <span>优惠券：</span>
          <span>无优惠券可用</span>
      </div>
      <div class="car-pay">
        <span>配送费用</span>
        <span v-if="!selectedAddress">请先选择配送地址</span>
        <span class="price">+￥0.00</span>
      </div>
    </div>

    <div class="pay-mode">
      <div class="tit">支付方式</div>
      <div class="money">
        <span><van-icon name="balance-o" />余额支付（可用 ¥ {{personal.balance}} 元）</span>
        <span class="red"><van-icon name="passed" /></span>
      </div>
    </div>

    <div class="comment">
      <textarea v-model="remark" name="" id="" cols="30" rows="10" placeholder="选填：买家留言（50字内）"></textarea>
    </div>

    <van-submit-bar label="实付款" text-align="left" :price="order.orderTotalPrice*100" button-text="提交订单" @submit="submitOrder" />
  </div>
</template>

<script>
import { getAddressList } from '@/api/address'
import { checkOrder, submitOrder } from '@/api/order'
export default {
  name: 'PayIndex',
  data () {
    return {
      addressList: [],
      order: [],
      personal: [],
      remark: ''
    }
  },
  created () {
    this.getAddressList()
    this.getOrderList()
  },
  methods: {
    async getAddressList () {
      const { data: { list } } = await getAddressList()
      this.addressList = list
    },
    async getOrderList () {
      if (this.mode === 'cart') {
        const { data: { order, personal } } = await checkOrder(this.mode, {
          cartIds: this.cartIds
        })
        this.order = order
        this.personal = personal
      }
      if (this.mode === 'buyNow') {
        const { data: { order, personal } } = await checkOrder(this.mode, {
          goodsId: this.goodsId,
          goodsSkuId: this.goodsSkuId,
          goodsNum: this.goodsNum
        })
        this.order = order
        this.personal = personal
      }
    },
    async submitOrder () {
      if (this.mode === 'cart') {
        await submitOrder(this.mode, {
          remark: this.remark,
          cartIds: this.cartIds
        })
      }
      if (this.mode === 'buyNow') {
        await submitOrder(this.mode, {
          goodsId: this.goodsId,
          goodsSkuId: this.goodsSkuId,
          goodsNum: this.goodsNum,
          remark: this.remark
        })
      }
      this.$toast.success('支付成功')
      this.$router.replace('/myorder')
    }
  },
  computed: {
    selectedAddress () {
      return this.addressList[0] || {}
    },
    longAddress () {
      const region = this.selectedAddress.region
      return region.province + region.city + region.region + this.selectedAddress.detail
    },
    mode () {
      return this.$route.query.mode
    },
    cartIds () {
      return this.$route.query.cartIds
    },
    goodsId () {
      return this.$route.query.goodsId
    },
    goodsSkuId () {
      return this.$route.query.goodsSkuId
    },
    goodsNum () {
      return this.$route.query.goodsNum
    }
  }
}
</script>

<style lang="less" scoped>
.pay{
  padding-top: 46px;
  padding-bottom: 50px;
}

.address{
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 10px;
  position: relative;
  background: url(@/assets/border-line.png) bottom repeat-x;
  background-size: 60px auto;
  color:gray;
  .left-icon{
    margin-right: 20px;
  }
  .right-icon{
    position: absolute;
    right:20px
  }
}

.goods{
  padding:20px;
  background-color: #fff;
  display: flex;
  font-size: 10px;
  color: #323233;
  height: 100px;
  .left{
    width: 100px;
    img{
      width: 80px;
    }
  }
  .right{
    flex:1;
    flex-direction: column;
    display: flex;
    .goods-name{
      display: -webkit-box; /* 设置为WebKit内核的弹性盒子模型 */
      -webkit-box-orient: vertical; /* 垂直排列 */
      -webkit-line-clamp: 2; /* 限制显示两行 */
      overflow: hidden; /* 隐藏超出范围的内容 */
      text-overflow: ellipsis; /* 使用省略号 */
    }
    .info{
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
    }
  }
}
.total{
  font-size: 10px;
  color: #323233;
  display: flex;
  justify-content: end;
  padding: 10px;
  border-bottom: 1px solid #efefef;
}
.pay-list{
  display: flex;
  flex-direction: column;
  display: flex;
  font-size: 10px;
  padding: 10px;
  color: #323233;
  border-bottom: 1px solid #efefef;
  .pay-cell{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
  .total-price{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .car-pay{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
}
.pay-mode{
  padding: 10px;
  font-size: 10px;
  color: #323233;
  border-bottom: 1px solid #efefef;
  .tit{
    margin:10px 0;
  }
  .money{
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .red{
      color: red;
      font-size: 15px;
    }
  }
}
.comment{
  padding: 10px;
  border-bottom: 1px solid #efefef;
  textarea{
    border:none;
    font-size: 9px;
  }
}
.price{
  color: #fa2209;
}
</style>

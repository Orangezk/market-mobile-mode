<template>
  <div class="home">
    <van-nav-bar title="智慧商城" fixed />
    <van-search
        v-model="value"
        shape="round"
        background="#f1f1f2"
        placeholder="请输入搜索关键词"
        input-align="center"
        @click="$router.push('/search')"
        readonly
      />

    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in bannerList" :key="item.imgUrl">
        <img :src="item.imgUrl" alt="">
      </van-swipe-item>
    </van-swipe>

    <van-grid column-num="5" icon-size="40">
      <van-grid-item v-for="item in navList" :key="item.imgUrl" :icon="item.imgUrl" text="新品首发" @click="$router.push('/category')"/>
    </van-grid>

    <div class="main">
      <img src="@/assets/main.png" alt="">
    </div>

    <div class="guess">
      <p class="guess-title">—— 猜你喜欢 ——</p>

      <div class="goods-list">
        <GoodsItem v-for="item in proList" :key="item.goods_id" :item="item"></GoodsItem>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getHome } from '@/api/home'
export default {
  name: 'HomeIndex',
  data () {
    return {
      bannerList: [],
      navList: [],
      proList: [],
      value: ''
    }
  },
  components: {
    GoodsItem
  },
  async created () {
    const { data: { pageData } } = await getHome()
    console.log(pageData)
    this.bannerList = pageData.items[1].data
    this.navList = pageData.items[3].data
    this.proList = pageData.items[6].data
  }
}
</script>

<style lang="less" scoped>
.home{
  padding-top: 100px;
  padding-bottom: 50px;
  background-color: rgb(223, 220, 220);
  .van-nav-bar {
    z-index: 999;
    background-color: #c21401;
    ::v-deep .van-nav-bar__title {
      color: #fff;
    }
  }
  .van-search {
    position: fixed;
    width: 100%;
    top: 46px;
    z-index: 999;
  }
  .my-swipe .van-swipe-item {
    height: 185px;
    color: #fff;
    font-size: 20px;
    text-align: center;
    background-color: #39a9ed;
  }
  .my-swipe .van-swipe-item img {
    width: 100%;
    height: 185px;
  }
  .main img {
    display: block;
    width: 100%;
  }
  .guess .guess-title {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .goods-list {
    background-color: #f6f6f6;
  }
}
</style>

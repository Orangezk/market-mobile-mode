<template>
  <div class="category">
    <van-nav-bar
      title="全部分类"
      fixed
    />

    <van-search
      readonly
      shape="round"
      background="#f1f1f2"
      placeholder="请输入搜索关键词"
      @click="$router.push('/search')"
    />

    <div class="list-box">
      <div class="left">
        <van-sidebar v-model="activeKey">
          <van-sidebar-item v-for="(item,index) in list" :key="item.category_id"  :title="item.name" @click="activeKey=index" />
        </van-sidebar>
      </div>
      <div class="right">
        <div class="cate-goods"
        v-for="item in list[activeKey]?.children" :key="item.category_id"
        @click="$router.push(`/searchList?categoryId=${item.category_id}`)"
        >
          <img :src="item.image?.external_url" alt="">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategory } from '@/api/category'
export default {
  name: 'CategoryIndex',
  data () {
    return {
      activeKey: 0,
      list: []
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      const { data: { list } } = await getCategory()
      console.log(list)
      this.list = list
    }
  }
}
</script>

<style lang="less" scoped>
.category{
  padding-top: 100px;
  padding-bottom: 50px;
  height: 100vh;
  .list-box{
    height: 100%;
    display: flex;
    .left{
      width: 80px;
      height: 100%;
      background-color: #f3f3f3;
      overflow: auto;
    }
    .right{
      flex:1;
      height: 100%;
      background-color: #ffffff;
      display: flex;
      flex-wrap:wrap;
      justify-content: flex-start;
      align-content: flex-start;
      padding: 10px 0;
      overflow: auto;
      .cate-goods{
        width: 33.3%;
        margin-bottom: 10px;
        img{
          width: 70px;
          height: 70px;
          display: block;
          margin: 5px auto;
        }
        p{
          text-align: center;
          font-size: 12px;
        }
      }
    }
  }
}

.van-nav-bar {
  z-index: 999;
}

.van-search {
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
}
</style>

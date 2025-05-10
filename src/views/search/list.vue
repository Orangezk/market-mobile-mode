<template>
  <div class="searchList">
    <van-nav-bar
      title="商品列表"
      left-arrow
      @click-left="$router.push('/search')"
    />

    <van-search
      readonly
      shape="round"
      :value="querySearch||'搜索商品'"
      show-action
      placeholder="value"
      @click="$router.push('/search')"
    >
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>

    <div class="title">
      <span class="item">综合</span>
      <span class="item">销量</span>
      <span class="item">价格</span>
    </div>

    <div class="list">
      <GoodsItem v-for="item in proList" :key="item.GoodsItem" :item="item"></GoodsItem>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getProduct } from '@/api/product'
export default {
  name: 'SearchList',
  components: {
    GoodsItem
  },
  computed: {
    querySearch () {
      return this.$route.query.search
    }
  },
  data () {
    return {
      page: 1,
      proList: []
    }
  },
  async created () {
    const { data: { list } } = await getProduct({
      categoryId: this.$route.query.categoryId,
      goodsName: this.querySearch,
      page: this.page
    })
    this.proList = list.data
  }
}
</script>

<style lang="less" scoped>
.searchList{
  .title{
    display: flex;
    // font-size: 16px;
    // justify-content: space-evenly;
    height: 36px;
    line-height: 36px;
    .item {
      text-align: center;
      flex: 1;
      font-size: 16px;
    }
  }
  .tool{
    font-size: 24px;
    height: 40px;
    line-height: 40px;
  }
  .list{
    background-color: #f6f6f6;
  }
}
</style>


<template>
  <el-tooltip class="tooltip" placement="top" effect="light">
    <div slot="content">
      <p>推荐使用 alibaba fonticon 图标</p>
      <p>使用步骤：</p>
      <p>1.进入 <a href="https://www.iconfont.cn" target="_blank">iconfont</a> 页面</p>
      <p>2.找到对应的图片添加到项目中</p>
      <p>3.把图标复制到assets\icon中</p>
      <p>示例：icon icon-xinzeng</p></div>
    <i class="el-icon-warning"></i>
  </el-tooltip>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {

  },
  mounted() {

  }
};
</script>

<style scoped lang="scss">
.tooltip {
  padding: 10px;
}
</style>

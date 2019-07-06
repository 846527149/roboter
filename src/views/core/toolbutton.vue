<template>
  <el-form :inline="true" :size="size" @submit.native.prevent>
    <el-form-item>
      <el-button v-for="(item,index) in data" :key="index" :size="size" :icon="item.buttonImg" :type="item.buttonType" @click="buttonClick(item.buttonCode)">{{item.buttonName}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "toolbutton",
  props: {
    size: {
      // 按钮尺寸
      type: String,
      default: "mini"
    }
  },
  data() {
    return {
      data: null
    };
  },
  methods: {
    buttonClick: function($event) {
      this.$emit("buttonClick", $event);
    }
  },
  mounted() {
    let path = this.$route.path; // 父节点地址
    let userID=sessionStorage.getItem("user");//用户ID
    let params={path:path,userID:userID};
    this.$api.sys_button.findPageButtonList(params).then(res => {
      this.data = res.items;
    });
  }
};
</script>

<style scoped>
</style>

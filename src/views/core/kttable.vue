<template>
  <div>
    <!--表格栏-->
    <el-table :data="data.items" :highlight-current-row="highlightCurrentRow" @selection-change="selectionChange" @current-change="handleCurrentChange" v-loading="loading" :element-loading-text="$t('action.loading')" :border="border" :stripe="stripe" :show-overflow-tooltip="showOverflowTooltip" :size="size" :align="align" style="max-height:100%;">
      <el-table-column type="selection" width="40" v-if="showSelection"></el-table-column>
      <el-table-column fixed label="序号" width="50" align="center" type="index" :index="index">
      </el-table-column>
      <el-table-column v-for="column in columns" v-if="!column.hide" :header-align="headerAlign" :align="align" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter" >      
      </el-table-column>
      <el-table-column :label="$t('action.operation')" width="185" fixed="right" v-if="showOperation" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="icon icon-bianji" :label="$t('action.edit')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
          <kt-button icon="icon icon-delete" :label="$t('action.delete')" :perms="permsDelete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="changeSizeRequest" @current-change="refreshPageRequest" :current-page="pageRequest.page" :page-size="pageRequest.limit" :total="data.total" style="float:right;"></el-pagination>
    </div>
  </div>
</template>

<script>
import KtButton from "@/views/core/ktbutton";

export default {
  name: "kttable",
  components: {
    KtButton
  },
  props: {
    columns: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsEdit: String, // 编辑权限标识
    permsDelete: String, // 删除权限标识
    size: {
      // 尺寸样式
      type: String,
      default: "mini"
    },
    align: {
      // 文本对齐方式
      type: String,
      default: "right"
    },
    headerAlign: {
      // 文本对齐方式
      type: String,
      default: "center"
    },
    maxHeight: {
      // 表格最大高度
      type: Number,
      default: 420
    },
    showSelection: {
      // 是否显示复选框
      type: Boolean,
      default: true
    },
    showOperation: {
      // 是否显示操作组件
      type: Boolean,
      default: false
    },
    border: {
      // 是否显示边框
      type: Boolean,
      default: false
    },
    stripe: {
      // 是否显示斑马线
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      // // 是否高亮当前行
      type: Boolean,
      default: true
    },
    showOverflowTooltip: {
      // 是否单行显示
      type: Boolean,
      default: true
    },
    showBatchDelete: {
      // 是否显示操作组件
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 分页信息
      pageRequest: {
        page: 1,
        limit: this.$store.state.app.tableTheme.limit
      },
      loading: false, // 加载标识
      selections: []  // 列表选中列
    };
  },
  methods: {
    index(val) {
      return (this.pageRequest.page - 1) * this.pageRequest.limit + val + 1;
    },
    // 分页查询
    findPage: function() {
      this.loading = true;
      let callback = res => {
        this.loading = false;
      };
      this.$emit("findPage", {
        pageRequest: this.pageRequest,
        callback: callback
      });
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    // 选择切换
    handleCurrentChange: function(val) {
      this.$emit("handleCurrentChange", { val: val });
    },
    // 换页刷新
    refreshPageRequest: function(pageNum) {
      this.pageRequest.page = pageNum;
      this.findPage();
    },
    // 条数切换
    changeSizeRequest:function(size){
      this.pageRequest.page = 1;
      this.pageRequest.limit=size;
      this.findPage();
    },
    // 编辑
    handleEdit: function(index, row) {
      this.$emit("handleEdit", { index: index, row: row });
    },
    // 删除
    handleDelete: function(index, row) {
      this.delete(row.code);
    },
    // 批量删除
    handleBatchDelete: function() {
      let ids = this.selections.map(item => item.code).toString();
      this.delete(ids);
    },
  },
  mounted() {
    this.refreshPageRequest(1);
  }
};
</script>

<style scoped>
</style>

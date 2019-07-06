<template>
  <div>
    <!--表格栏-->
    <el-table :data="data.items" :highlight-current-row="highlightCurrentRow" @selection-change="selectionChange" @current-change="handleCurrentChange" v-loading="loading" :element-loading-text="$t('action.loading')" :border="border" :stripe="stripe" :show-overflow-tooltip="showOverflowTooltip" :size="size" :align="align" style="max-height:100%;">
      <el-table-column type="selection" width="40" v-if="showSelection"></el-table-column>
      <el-table-column fixed label="序号" width="50" align="center" type="index" :index="index">
      </el-table-column>
      <el-table-column v-for="column in columns" v-if="!column.hide && column.special && (column.special=='title')" :header-align="headerAlign" :align="align" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter" >            		
      	<template slot-scope="scope">
      		<span v-if="column.special=='title'" style="float:left;text-align: left;">{{scope.row.title}}{{scope.row.problemContets}}</span>
      	</template>
      </el-table-column>
      <el-table-column v-for="column in columns" v-if="!column.hide && !column.special" :header-align="headerAlign" :align="align" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter" >           	
      </el-table-column>
      <el-table-column v-for="column in columns" style="float: left;" v-if="!column.hide && column.special && (column.special !='title')" :header-align="headerAlign" :align="align" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter" >
      	<template slot-scope="scope">
      		<el-tag v-if="column.special=='client'" v-for="(scc,index) in scope.row.clientName" :key="index" type="success" style="float: left;margin:5px;color:#409eff;background-color: rgba(64,158,255,.1);border-color: rgba(64,158,255,.2);">{{scc}}</el-tag>
      		<el-tag v-if="column.special=='cates'" v-for="(scc,index) in scope.row.catesName" :key="index" type="success" style="float: left;margin:5px;color:#409eff;background-color: rgba(64,158,255,.1);border-color: rgba(64,158,255,.2);">{{scc}}</el-tag>
      		<el-tag v-if="column.special=='tags'" v-for="(scc,index) in scope.row.tagsName" :key="index" type="success" style="float: left;margin:5px;color:#409eff;background-color: rgba(64,158,255,.1);border-color: rgba(64,158,255,.2);">{{scc}}</el-tag>
      		<el-tag v-if="column.special=='clientname'" v-for="(scc,index) in scope.row.clientname" :key="index" type="success" style="float: left;margin:5px;color:#409eff;background-color: rgba(64,158,255,.1);border-color: rgba(64,158,255,.2);">{{scc}}</el-tag>
      		<img :src="ImgLink+scope.row.path" v-if="column.special=='img'" style="height:50px;"/>
      		<img :src="ImgLink+scope.row.imgPath" v-if="column.special=='img_path'" style="height:50px;"/>
      		<img :src="ImgLink+scope.row.smallImg" v-if="column.special=='img_small'" style="height:50px;"/> 
      		<img :src="ImgLink+scope.row.picturePath" v-if="column.special=='img_picture'" style="height:50px;"/>
      		<img :src="ImgLink+scope.row.problemImage" v-if="column.special=='img_problemImage'" style="height:50px;"/>
      		<img :src="ImgLink+scope.row.figureUrl" v-if="column.special=='img_figure'" style="height:50px;"/> 
      		<el-switch v-if="column.special=='isEnabled'" v-model="scope.row.isEnabled" active-color="#13ce66" @change="SwitchChange(scope.row)"></el-switch>
      		<el-switch v-if="column.special=='isEnable'" v-model="scope.row.isEnable" active-color="#13ce66" @change="SwitchChange(scope.row)"></el-switch>
      		<el-switch v-if="column.special=='isTop'" v-model="scope.row.isTop" active-color="#13ce66" @change="SwitchChange(scope.row)"></el-switch>
      		<el-switch v-if="column.special=='isRecommend'" v-model="scope.row.isRecommend" active-color="#13ce66" @change="SwitchChange(scope.row)"></el-switch>
      	</template>
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
      <el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="changeSizeRequest" @current-change="refreshPageRequest" :current-page="pageRequest.page" :page-size="pageRequest.limit" :total="data.total" style="float:right;margin-bottom:30px;"></el-pagination>
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
      selections: [], // 列表选中列
      ImgLink:''      //获取请求地址
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
    //开关
    SwitchChange(val){
    	this.$emit("SwitchChange", val);
    }
  },
  mounted() {
  	this.ImgLink=process.env.BASE_API.split("api")[0];
    this.refreshPageRequest(1);
  }
};
</script>

<style scoped>
</style>

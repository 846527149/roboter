<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar left">
      <el-form :inline="true" :model="filters" :size="this.tableTheme.size" @submit.native.prevent>
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button icon="icon icon-shuaxin" @click="findPage(null)"></el-button>
            </el-tooltip>
            <el-tooltip content="列显示" placement="top">
              <el-button icon="icon icon-guolv" @click="displayFilterColumnsDialog"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.name" @keyup.enter.native="findPage(null)" placeholder="分类名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :size="this.tableTheme.size" icon="icon icon-chaxun" type="primary" @click="findPage(null)">{{$t('action.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar right">
      <tool-button ref="toolbutton" @buttonClick="buttonClick"></tool-button>
    </div>
    <div class="toolbar">
      <!--表格显示列界面-->
      <table-column-filter-dialog ref="tableColumnFilterDialog" :align="this.tableTheme.align" :columns="columns" @handleFilterColumns="handleFilterColumns"></table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <KttableEnhance ref="kttable" :headerAlign="this.tableTheme.headerAlign" :align="this.tableTheme.align" :stripe="this.tableTheme.stripe" :size="this.tableTheme.size" :border="this.tableTheme.border" :data="pageResult" :columns="filterColumns" @findPage="findPage" ></KttableEnhance>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="this.tableTheme.size" label-position="right">
        <el-form-item label="Code" prop="topCode" v-if="false">
          <el-input v-model="dataForm.topCode" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dataForm.name" maxlength="50" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类图片" prop="picturePath">
          <UpLoad @listenToChildEvent="listenToChildEvent" :ImgUrl="ImgUrl"></UpLoad>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="this.tableTheme.size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="this.tableTheme.size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import KttableEnhance from "@/views/core/kttableEnhance";
import KtButton from "@/views/core/ktbutton";
import ToolButton from "@/views/core/toolbutton";
import TableColumnFilterDialog from "@/views/core/tablecolumnfilterdialog";
import { formatDate } from "@/utils/datetime";
import { StingBase64 } from "@/utils/substring";
import UpLoad from "@/components/upload/upload";

export default {
  components: {
    PopupTreeInput,
    KttableEnhance,
    ToolButton,
    KtButton,
    TableColumnFilterDialog,
    UpLoad
  },
  data() {
    return {
      tableTheme: this.$store.state.app.tableTheme,
      filters: {
        name: ""
      },
      columns: [],
      filterColumns: [],
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]      
      },
      //新增编辑界面数据
      dataForm: {
        topCode: "",
        name: "",
        picturePath:''
      },
      
      ImgLink:'',        //获取请求地址
      ImgUrl: "",        //图片
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }else{
        this.pageRequest.page=1;
      }
      this.pageRequest.filter = this.filters.name;
      this.$api.product.TopCategoryPage(this.pageRequest)       
      .then(res => {
        this.pageResult = res; 
      })
      .then(data != null ? data.callback : "");
    },
    // 按钮事件
    buttonClick: function($event) {
      if ($event == "handleAdd") {
        this.handleAdd();
      } else if ($event == "handleEdit") {
        this.handleEdit();
      } else if ($event == "handleDelete") {
        this.handleDelete();
      }
    },
    // 删除
    handleDelete: function() {
      let selectData = this.$refs.kttable.selections;
      if (selectData.length == 0) {
        this.$message({ message: "请选择数据后删除", type: "error" });
        return;
      }
      this.$confirm("删除该分类会同时删除相关联的二级分类及产品，确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        let params = [];
        for (var i = 0; i < selectData.length; i++) {
          params.push({ ID: selectData[i].topCode });
        }
        this.loading = true;
        this.$api.product.DeleteTopCategroy(params)
          .then(res => {
            this.$message({ message: "删除成功", type: "success" });
            this.findPage(null);
          })
          .finally(res => {
            this.loading = false;
          });
      });
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        topCode: "",
        name: "",
        picturePath:''
      };
      this.ImgUrl="";
    },
    // 显示编辑界面
    handleEdit: function() {
      let selectData = this.$refs.kttable.selections;
      if (selectData.length != 1) {
        this.$message({ message: "请选择一条数据后编辑", type: "error" });
        return;
      }
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, selectData[0]);
      this.ImgUrl=this.ImgLink.split("api")[0]+this.dataForm.picturePath;
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
          	this.$api.product.CreateOrUpdateTopCategroy(params)
            .then(res => {
              this.dialogVisible = false;
              this.$message({ message: "操作成功", type: "success" });
              this.$refs["dataForm"].resetFields();
              this.findPage(null);
            })
            .finally(res => {
              this.editLoading = false;
            })          
          })
        }
      })
    },
    //上传
    listenToChildEvent(base64){
    	this.ImgUrl=base64;
    	this.editLoading = true;
    	this.$api.upload.UploadImgByBase64(StingBase64(base64),2)
	  	.then( data => {
	  		this.dataForm.picturePath=data;  		
	  	})
	  	.finally(res => {
        this.editLoading = false;
      })
    },
    // 处理表格列过滤显示
    displayFilterColumnsDialog: function() {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true);
    },
    // 处理表格列过滤显示
    handleFilterColumns: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [			
        //表格字段
        { prop: "name", label: "分类名称", minWidth: 120 },
        { prop: "picturePath", label: "分类图片", minWidth: 60, special: "img_picture" }
      ];
      this.filterColumns = this.columns;
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return formatDate(row[column.property]);
    }
  },
  created(){
  	this.ImgLink=process.env.BASE_API;
  },
  mounted() {  	
    this.initColumns();
  }
};
</script>

<style scoped>
</style>

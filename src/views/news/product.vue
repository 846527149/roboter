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
          <el-input v-model="filters.name" @keyup.enter.native="findPage(null)" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.secondCategoryCode" clearable placeholder="产品分类" style="width:150px">
				    <el-option
				      v-for="item in SecondCategoryList"
				      :key="item.secondCategory"
				      :label="item.name"
				      :value="item.secondCategory">
				    </el-option>
				  </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.isEnable" clearable placeholder="是否启用" style="width:150px">
				    <el-option
				      v-for="item in isEnableList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
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
    <kttableEnhance ref="kttable" :headerAlign="this.tableTheme.headerAlign" :align="this.tableTheme.align" :stripe="this.tableTheme.stripe" :size="this.tableTheme.size" :border="this.tableTheme.border" :data="pageResult" :columns="filterColumns" @findPage="findPage" @SwitchChange="SwitchChange"></kttableEnhance>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="this.tableTheme.size" label-position="right">
        <el-form-item label="Code" prop="productCode" v-if="false">
          <el-input v-model="dataForm.productCode" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="dataForm.name" maxlength="50" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="发布者" prop="author">
          <el-input v-model="dataForm.author" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品详情" prop="contents">
        	<TinymceEditor
        		:value="dataForm.contents"
        		@onClick="clickTinymce"
        		>	        		
         	</TinymceEditor>
        </el-form-item>        
        <el-form-item label="产品分类" prop="secondCategoryCode">
          <el-select v-model="dataForm.secondCategoryCode" placeholder="请选择">
				    <el-option
				      v-for="item in SecondCategoryList"
				      :key="item.secondCategory"
				      :label="item.name"
				      :value="item.secondCategory">
				    </el-option>
				  </el-select>
        </el-form-item> 
        <el-form-item label="价格" prop="price">
          <el-input v-model="dataForm.price" auto-complete="off" style="width:100px;"></el-input> <span>元</span><!--<span style="color:#F56C6C;margin-left:20px">保留小数点后两位</span>-->
        </el-form-item>
        <el-form-item label="阅读数" prop="viewTimes">
          <el-input-number v-model="dataForm.viewTimes" label="描述文字"></el-input-number>
        </el-form-item>	
	      <el-form-item label="点赞数" prop="likes">
		      <el-input-number v-model="dataForm.likes" label="描述文字"></el-input-number>
		    </el-form-item>
        <el-form-item label="产品配图" prop="picturePath">
          <UpLoad @listenToChildEvent="listenToChildEvent" :ImgUrl="ImgUrl" ImgWidth="100" ImgHeight="100" style="float:left"></UpLoad>
          <span style="float:left;color:#F56C6C;line-height:100px;margin-left:10px">推荐图片大小：宽150像素，高150像素</span>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnable">
      		<el-switch
					  v-model="dataForm.isEnable"
					  active-color="#13ce66">
					</el-switch>
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
import TinymceEditor from '@/components/tinymce/tinymce'

export default {
  components: {
    PopupTreeInput,
    KttableEnhance,
    ToolButton,
    KtButton,
    TableColumnFilterDialog,
    UpLoad,
    TinymceEditor
  },
  data() {
  	var checkprice = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请输入产品价格'));
      }
      setTimeout(() => {
        if( ! /^\d+\.?\d{0,2}$/.test(value)){
          callback(new Error('只能输入数字，小数点后只能保留两位'));
        }else{
          callback();
        }
      },500);
    };
    return {
      tableTheme: this.$store.state.app.tableTheme,
      filters: {
        name: "",
        secondCategoryCode: "",
        isEnable :""
      },
      columns: [],
      filterColumns: [],
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
      	secondCategoryCode: [{ required: true, message: "请选择产品分类", trigger: "blur" }],
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        //author: [{ required: true, message: "请输入发布者", trigger: "blur" }],
        contents: [{ required: true, message: "请输入产品详情", trigger: "blur" }],
        //price: [{ required: true, validator: checkprice, trigger: "blur" }],
        picturePath: [{ required: true, message: "请上传产品图片", trigger: "blur" }]
      },
      //新增编辑界面数据
      dataForm: {
        productCode: "",
        secondCategoryCode: "",
        name: "",
        author: "",
        contents: "",
        price: 0,
        viewTimes: 0,
        likes:0,
        picturePath: "",
        isEnable: true,
      },
      ImgLink:'',        //获取请求地址
      ImgUrl: "",        //图片
      SecondCategoryList:[],     //产品分类列表
      isEnableList:[     //是否启用列表
				{
					key:true,
					value:'是'
				},{
					key:false,
					value:'否'
				}
      ]
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
      this.pageRequest.secondCategoryCode = this.filters.secondCategoryCode;    
      this.pageRequest.isEnable = this.filters.isEnable;
      this.$api.product.findPage(this.pageRequest)       
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
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        let params = [];
        for (var i = 0; i < selectData.length; i++) {
          params.push({ ID: selectData[i].productCode });
        }
        this.loading = true;
        this.$api.product.batchDelete(params)
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
        productCode: "",
        secondCategoryCode: "",
        name: "",
        author: "",
        contents: "",
        price: 0,
        viewTimes: 0,
        likes:0,
        picturePath: "",
        isEnable: true,
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
      this.dataForm.bannerType=this.dataForm.bannerType;
      this.ImgUrl=this.ImgLink.split("api")[0]+this.dataForm.picturePath;
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.product.save(params)
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
    //产品分类
    SecondCategoryPage(){
    	this.editLoading = true;
    	let SecondCategory = {
    		page:1,
    		limit:10000
    	}
    	this.$api.product.SecondCategoryPage(SecondCategory)
	  	.then( data => {
	  		this.SecondCategoryList=data.items;
	  	})
	  	.finally(res => {
        this.editLoading = false;
      })
    },
    //富文本编辑
    clickTinymce(index){
  		this.dataForm.contents=index;
  	},
    //表格开关改变
    SwitchChange(val){
    	this.dataForm = val;    	    	
    	this.editLoading = true;
      let params = Object.assign({}, this.dataForm);
    	this.$api.product.save(params)
      .then(res => {
        this.$message({ message: "操作成功", type: "success" });
        this.findPage(null);
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
      this.columns = [																											//表格字段
        { prop: "name", label: "产品名称", minWidth: 140 },
        { prop: "secondCategoryName", label: "产品类型", minWidth: 80 },  
        { prop: "author", label: "维护人", minWidth: 80 },
        { prop: "viewTimes", label: "阅读数", minWidth: 80 },
        { prop: "likes", label: "点赞数", minWidth: 80 },
        { prop: "createDate", label: "发布时间", minWidth: 80, formatter: this.dateFormat }, 
        { prop: "isEnable", label: "是否启用", minWidth: 80, special: "isEnable"},
        { prop: "picturePath", label: "产品图片", minWidth: 120 ,special: "img_picture" }
      ];
      //this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      this.filterColumns = this.columns;
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return formatDate(row[column.property]);
    }
  },
  created(){
  	this.ImgLink=process.env.BASE_API;
  	this.SecondCategoryPage();
  },
  mounted() {  	
  	this.initColumns();
  }
};
</script>

<style>
	.tox-silver-sink{
		z-index:10000 !important;
	}
</style>

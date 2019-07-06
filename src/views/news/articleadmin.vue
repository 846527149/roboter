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
          <el-input v-model="filters.name" @keyup.enter.native="findPage(null)" placeholder="文章名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.clients" multiple placeholder="显示端">
				    <el-option
				      v-for="item in ClientList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.cates" multiple placeholder="分类">
				    <el-option
				      v-for="item in ClassListSearch"
				      :key="item.code"
				      :label="item.name"
				      :value="item.code">
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
    <KttableEnhance ref="kttable" :headerAlign="this.tableTheme.headerAlign" :align="this.tableTheme.align" :stripe="this.tableTheme.stripe" :size="this.tableTheme.size" :border="this.tableTheme.border" :data="pageResult" :columns="filterColumns" @findPage="findPage" @SwitchChange="SwitchChange"></KttableEnhance>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" :fullscreen="false" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="this.tableTheme.size" label-position="right">       
        <el-row :gutter="10">
	        <el-col :span="8">
		        <el-form-item label="Code" prop="tagCode" v-if="false">
		          <el-input v-model="dataForm.tagCode" :disabled="true" auto-complete="off"></el-input>
		        </el-form-item>
	        </el-col>
	        <el-col :span="8">
		        <el-form-item label="文章标题" prop="title">
		          <el-input v-model="dataForm.title" maxlength="50" auto-complete="off"></el-input>
		        </el-form-item>
	        </el-col>
	        <el-col :span="8">
	        	<el-form-item label="作者" prop="author">
		          <el-input v-model="dataForm.author" maxlength="20" auto-complete="off"></el-input>
		        </el-form-item>
	        </el-col>
        </el-row>
        <el-row :gutter="10">
	        <el-col :span="8">
	        	<el-form-item label="文章分类" prop="catesCode">
		          <el-select v-model="dataForm.catesCode" multiple placeholder="请选择" style="width:250px">
						    <el-option
						      v-for="item in ClassList"							      
						      :key="item.code"
						      :label="item.name"
						      :value="item.code">
						    </el-option>
						  </el-select>
		        </el-form-item>
	        </el-col>
	      </el-row>
	      <el-row :gutter="10">
		      <el-col :span="8">
	        	<el-form-item label="阅读数量" prop="viewTimes">
		          <el-input-number v-model="dataForm.viewTimes" label="描述文字"></el-input-number>
		        </el-form-item>
	        </el-col> 
	        <el-col :span="8">
	        	<el-form-item label="点赞数量" prop="likes">
		          <el-input-number v-model="dataForm.likes" label="描述文字"></el-input-number>
		        </el-form-item>
	        </el-col> 
        </el-row>
        <el-row :gutter="10">
		      <el-col :span="8">
	        	<el-form-item label="是否置顶" prop="isTop">
	        		<el-switch
							  v-model="dataForm.isTop"
							  active-color="#13ce66">
							</el-switch>
		        </el-form-item>
	        </el-col> 
	        <el-col :span="8">
	        	<el-form-item label="是否推荐" prop="isRecommend">
	        		<el-switch
							  v-model="dataForm.isRecommend"
							  active-color="#13ce66">
							</el-switch>
		        </el-form-item>
	        </el-col> 
        </el-row>
        <el-col :span="24">
        	<el-form-item label="图片" prop="smallImg">
	          <UpLoad @listenToChildEvent="listenToChildEvent_small" :ImgUrl="ImgUrl_small" style="float:left"></UpLoad>
	          <span style="float:left;color:#F56C6C;line-height:83px;margin-left:10px">推荐图片大小：宽230像素，高166像素</span>
	        </el-form-item>
        </el-col>  
        <el-col :span="24">
	        <el-form-item label="文章内容" prop="contents">
	        	<TinymceEditor
	        		:value="dataForm.contents"
	        		@onClick="clickTinymce"
	        		>	        		
	         	</TinymceEditor>
	        </el-form-item>
        </el-col>         
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
    return {
      tableTheme: this.$store.state.app.tableTheme,
      filters: {
        name: "",
        cates:[],
        clients:[]
      },
      columns: [],
      filterColumns: [],
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        author: [{ required: true, message: "请输入作者", trigger: "blur" }],
        catesCode: [{ required: true, message: "请选择文章分类", trigger: "blur" }],
        smallImg: [{ required: true, message: "请上传图片", trigger: "blur" }],
        contents: [{ required: true, message: "请输入文章内容", trigger: "blur" }]
      },
      //新增编辑界面数据
      dataForm: {
        articleCode: "",
        title: "",
        author: "百诺汇一",
        contents: "",       
        cates: [],
        bigImg: "",
        smallImg: "",
        viewTimes: 0,
        likes: 0,
        isTop: false,
        isRecommend: false
      },      
      ImgLink:'',        //获取请求地址
      ImgUrl_small: "",  //配图_小图
      ClassList:[],       //分类列表  用于增加编辑
      ClassListSearch:[], //分类列表  用于搜索
      ClientList:[],     //显示端列表  
    };
  },
  methods: {
  	//富文本编辑
  	clickTinymce(index){
  		this.dataForm.contents=index;
  	},
    // 获取分页数据
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }else{
        this.pageRequest.page=1;
      }
      this.pageRequest.filter = this.filters.name;    
      this.pageRequest.cates = this.filters.cates;   
      this.pageRequest.clients = this.filters.clients;   
      this.$api.new_articleadmin.findPage(this.pageRequest)       
      .then(res => {
        this.pageResult = res;    
        let articleList = this.pageResult.items;
        for(let i in articleList){       	
        	let clientname = [];
        	let clientcode = [];
        	let catesname = [];
        	let catescode = [];
        	for(let j in articleList[i].client){
        		clientname.push(articleList[i].client[j].clientName)
        		clientcode.push(articleList[i].client[j].clientCode)
        	}
        	for(let j in articleList[i].cates){
        		catesname.push(articleList[i].cates[j].cateName)
        		catescode.push(articleList[i].cates[j].cateCode)
        	} 	
        	this.pageResult.items[i].clientName = clientname;
        	this.pageResult.items[i].clientCode = clientcode;
        	this.pageResult.items[i].catesName = catesname;
        	this.pageResult.items[i].catesCode = catescode;
        }
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
          params.push({ ID: selectData[i].articleCode });
        }
        this.loading = true;
        this.$api.new_articleadmin.batchDelete(params)
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
        articleCode: "",
        title: "",
        author: "百诺汇一",
        contents: "",       
        cates: [],
        smallImg: "",
        viewTimes: 0,
        likes: 0,
        isTop: false,
        isRecommend: false
      };
      this.ImgUrl_small="";
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
      this.ImgUrl_small=this.ImgLink.split("api")[0]+this.dataForm.smallImg;
    },
    // 编辑
    submitForm: function() {
      //return
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            params.cates=params.catesCode;
            delete params.catesCode;
            delete params.catesName;
            delete params.client;
            delete params.clientCode;
            delete params.clientName;
          	this.$api.new_articleadmin.save(params)
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
    //上传小图
    listenToChildEvent_small(base64){
    	this.ImgUrl_small=base64;
    	this.editLoading = true;
    	this.$api.upload.UploadImgByBase64(StingBase64(base64),2)
	  	.then( data => {
	  		this.dataForm.smallImg=data;  		
	  	})
	  	.finally(res => {
        this.editLoading = false;
      })
    },
    //显示端列表 分类列表 标签列表
    GetClient(){
    	let search = {page:1,limit:10000}
    	//获取显示端列表
    	this.editLoading = true;
    	this.$api.public_client.GetClient()
	  	.then( data => {
	  		this.ClientList=data.items;
	  	})
	  	.finally(res => {
        this.editLoading = false;
      })
	  	
	  	//文章分类
	  	this.editLoading = true;
    	this.$api.new_articleclass.findPage(search)       
      .then(data => { 
      	this.ClassListSearch = data.items; 
      })
	  	.finally(res => {
        this.editLoading = false;
      })
	  	//文章分类
	  	this.editLoading = true;
    	this.$api.new_articleclass.findPage(search)       
      .then(data => { 
				//ClassList列表修改影响data值，原因尚未确定
        this.ClassList = data.items; 
        for(let i in this.ClassList){
        	let clientArray = []
        	for(let j in this.ClassList[i].client){
        		clientArray.push(this.ClassList[i].client[j].clientName)
        	}
        	this.ClassList[i].name=this.ClassList[i].name+" （"+clientArray.join("，")+"）"
        }
      })
	  	.finally(res => {
        this.editLoading = false;
      })
    },
    //表格开关改变
    SwitchChange(val){
    	this.dataForm = val;    	    	
    	this.editLoading = true;
      let params = Object.assign({}, this.dataForm);
      params.cates=params.catesCode;
      delete params.catesCode;
      delete params.catesName;
      delete params.client;
      delete params.clientCode;
      delete params.clientName;
    	this.$api.new_articleadmin.save(params)
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
      this.columns = [			
        //表格字段
        { prop: "title", label: "文章标题", minWidth: 150, special: "title" },
        { prop: "author", label: "作者", minWidth: 60 },
        { prop: "clientName", label: "显示终端", minWidth: 120, special: "client" },
        { prop: "catesName", label: "文章分类", minWidth: 120, special: "cates"},
				{ prop: "isTop", label: "是否置顶", minWidth: 60, special: "isTop"},
				{ prop: "isRecommend", label: "是否推荐", minWidth: 60, special: "isRecommend"},
        { prop: "createDate", label: "创建时间", minWidth: 60 ,formatter: this.dateFormat },
        { prop: "smallImg", label: "图片", minWidth: 100, special: "img_small"}
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
  	this.GetClient();
  },
  mounted() {  	
    this.initColumns();    
  }
};
</script>

<style>
	.tox-silver-sink{
		z-index:3000 !important;
	}
</style>

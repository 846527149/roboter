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
          <el-input v-model="filters.name" @keyup.enter.native="findPage(null)" placeholder="海报名称"></el-input>
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
    <kttableEnhance v-if="tableShow" ref="kttable" :headerAlign="this.tableTheme.headerAlign" :align="this.tableTheme.align" :stripe="this.tableTheme.stripe" :size="this.tableTheme.size" :border="this.tableTheme.border" :data="pageResult" :columns="filterColumns" @findPage="findPage"></kttableEnhance>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="this.tableTheme.size" label-position="right">
        <el-form-item label="Code" prop="code" v-if="false">
          <el-input v-model="dataForm.code" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="海报名称" prop="title">
          <el-input v-model="dataForm.title" maxlength="50" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="外部链接" prop="contents">
          <el-input v-model="dataForm.contents" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="海报类型" prop="bannerType">
          <el-select v-model="dataForm.bannerType" placeholder="请选择类型">
          	<el-option v-for="(scc,index) in BannerType" :key="index" :label="scc.value" :value="scc.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示终端" prop="client">
          <el-select v-model="dataForm.client" multiple placeholder="请选择">
				    <el-option
				      v-for="item in ClientList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
        </el-form-item>        
        <el-form-item label="图片" prop="path">
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
      	title: [{ required: true, message: "请输入海报标题", trigger: "blur" }],
        bannerType: [{ required: true, message: "请选择海报类型", trigger: "blur" }],
        client: [{ required: true, message: "请选择显示终端", trigger: "blur" }],
        path: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      //新增编辑界面数据
      dataForm: {
        code: "",
        title: "",
        contents: "",
        bannerType: 1,
        client: [],
        clientname: "",
        path: ""
      },
      ImgLink:'',        //获取请求地址
      ImgUrl: "",        //图片
      BannerType:[],     //海报类型列表
      ClientList:[],     //显示端列表
      
      tableShow:false
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
    	this.GetClient();
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }else{
        this.pageRequest.page=1;
      }
      this.pageRequest.filter = this.filters.name;
      this.$api.new_banner.findPage(this.pageRequest)       
      .then(res => {
        this.pageResult = res; 	
        let bannerls = this.pageResult.items;
        for(let i in bannerls){
        	let clientname = [];
        	for(let j in bannerls[i].client){       		
        		for(let k in this.ClientList){
        			if(bannerls[i].client[j]==this.ClientList[k].key){
        				clientname.push(this.ClientList[k].value);        				
        			}        			
        		}       		
        	}
        	this.pageResult.items[i].clientname=clientname;
        	for(let k in this.BannerType){
        		if(bannerls[i].bannerType==this.BannerType[k].key){
        			this.pageResult.items[i].bannerTypeName=this.BannerType[k].value;
        		}
        	}
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
          params.push({ ID: selectData[i].code });
        }
        this.loading = true;
        this.$api.new_banner.batchDelete(params)
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
        code: "",
        title: "",
        contents: "",
        bannerType: 1,
        client: [1],
        clientname: "",
        path: ""
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
      this.ImgUrl=this.ImgLink.split("api")[0]+this.dataForm.path;
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.new_banner.save(params)
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
    	this.$api.upload.UploadImgByBase64(StingBase64(base64),1)
	  	.then( data => {
	  		this.dataForm.path=data;  		
	  	})
	  	.finally(res => {
        this.editLoading = false;
      })
    },
    //海报类型查询
    GetBannerType(){
    	this.editLoading = true;
    	this.$api.new_banner.GetBannerType()
	  	.then( data => {
	  		this.BannerType=data.items; 
	  		this.tableShow=true;
	  		this.initColumns();    
	  	})
	  	.finally(res => {
        this.editLoading = false;
      })
    },
    //显示端列表
    GetClient(){
    	this.editLoading = true;
    	this.$api.public_client.GetClient()
	  	.then( data => {
	  		this.ClientList=data.items;
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
        { prop: "title", label: "海报名称", minWidth: 140 },
        { prop: "contents", label: "跳转地址", minWidth: 140 },        
        { prop: "bannerTypeName", label: "海报类型", minWidth: 80 },
        { prop: "clientname", label: "显示终端", minWidth: 120,special: "clientname"},
        { prop: "createDate", label: "创建时间", minWidth: 80, formatter: this.dateFormat },
        { prop: "path", label: "图片", minWidth: 120 ,special: "img" }
      ];
      //this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      this.filterColumns = this.columns;
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return formatDate(row[column.property]);
    }
  },
  mounted() {
  	this.ImgLink=process.env.BASE_API;
  	this.GetBannerType();
  }
};
</script>

<style scoped>
</style>

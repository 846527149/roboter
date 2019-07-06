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
          <el-input v-model="filters.name" @keyup.enter.native="findPage(null)" placeholder="题目名称"></el-input>
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
    <KttableEnhance ref="kttable" :headerAlign="this.tableTheme.headerAlign" :align="this.tableTheme.align" :stripe="this.tableTheme.stripe" :size="this.tableTheme.size" :border="this.tableTheme.border" :data="pageResult" :columns="filterColumns" @findPage="findPage" @SwitchChange="SwitchChange"></KttableEnhance>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="this.tableTheme.size" label-position="right">
        <el-form-item label="Code" prop="problemCode" v-if="false">
          <el-input v-model="dataForm.problemCode" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目名称" prop="problemContets">
          <el-input v-model="dataForm.problemContets" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目选项" prop="options">
          <CreateCheckboxInput @click="AddOption" :options="dataForm.options"></CreateCheckboxInput>
        </el-form-item>
        <el-form-item label="题目配图" prop="problemImage">
          <UpLoad @listenToChildEvent="listenToChildEvent" :ImgUrl="ImgUrl"></UpLoad>
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
import CreateCheckboxInput from "@/views/core/createcheckboxinput";

export default {
  components: {
    PopupTreeInput,
    KttableEnhance,
    ToolButton,
    KtButton,
    TableColumnFilterDialog,
    UpLoad,
    CreateCheckboxInput
  },
  data() {
  	var checkoptions = (rule, value, callback) => {
  		let lsnum=0;
  		for(let i in value){
  			if(value[i].optionContets == ""){
  				return callback(new Error('题目选项不能为空'));
  			}
  			setTimeout(() => {
	  			if(value[i].isAnswer == false){
	  				lsnum=lsnum+1;
	  				if(lsnum == value.length){
	  					return callback(new Error('至少要有一个正确选项'));
	  				}  				
	  			}else{
	  				callback();
	  			}
	  		},500);
  		}
    };
    return {
      tableTheme: this.$store.state.app.tableTheme,
      filters: {
        name: "",
        isEnable :""
      },
      columns: [],
      filterColumns: [],
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        //problemContets: [{ required: true, message: "请输入题目名称", trigger: "blur" }],
        options: [{  validator: checkoptions, required: true, trigger: "blur" }],
      },
      //新增编辑界面数据
      dataForm: {
        problemCode: "",
        problemContets: "",
        options:[{
	      	isAnswer: false,
					optionContets: "",
					sort: 0
	      }],
        isEnable:true,
        problemImage:''
      },
      
      ImgLink:'',        //获取请求地址
      ImgUrl: "",        //图片
      
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
      this.pageRequest.isEnable = this.filters.isEnable;
      this.$api.interesttitle.findPage(this.pageRequest)       
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
          params.push({ ID: selectData[i].problemCode });
        }
        this.loading = true;
        this.$api.interesttitle.batchDelete(params)
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
        problemCode: "",
        problemContets: "",
        options:[{
	      	isAnswer: false,
					optionContets: "",
					sort: 0
	      }],
        isEnable:true,
        problemImage:''
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
      this.ImgUrl=this.ImgLink.split("api")[0]+this.dataForm.problemImage;
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            for(let i in params.options){
            	params.options[i].sort = i;
            }
          	this.$api.interesttitle.save(params)
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
	  		this.dataForm.problemImage=data;  		
	  	})
	  	.finally(res => {
        this.editLoading = false;
      })
    },
    // 添加题目选项
    AddOption(index){
    	this.dataForm.options=index; 
    },
    //表格开关改变
    SwitchChange(val){
    	this.dataForm = val;    	    	
    	this.editLoading = true;
      let params = Object.assign({}, this.dataForm);
    	this.$api.interesttitle.save(params)
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
        { prop: "problemContets", label: "题目名称", minWidth: 200 ,special: "title" },
        { prop: "createDate", label: "创建时间", minWidth: 60 ,formatter: this.dateFormat },
        { prop: "isEnable", label: "是否启用", minWidth: 60 , special: "isEnable" },
        { prop: "problemImage", label: "题目配图", minWidth: 80, special: "img_problemImage" }
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

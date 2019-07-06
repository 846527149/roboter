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
          <el-input v-model="filters.name" @keyup.enter.native="findPage(null)" placeholder="姓名、账号、身份证号、手机号" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.UserType" clearable  placeholder="会员等级" style="width:150px">
				    <el-option
				      v-for="item in UserType"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.CardType" clearable  placeholder="持卡类型" style="width:150px">
				    <el-option
				      v-for="item in CardType"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.ClientSource" clearable  placeholder="客户来源" style="width:150px">
				    <el-option
				      v-for="item in ClientSource"
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
    <KtTable ref="kttable" :headerAlign="this.tableTheme.headerAlign" :align="this.tableTheme.align" :stripe="this.tableTheme.stripe" :size="this.tableTheme.size" :border="this.tableTheme.border" :data="pageResult" :columns="filterColumns" @findPage="findPage"></KtTable>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="this.tableTheme.size" label-position="right">
        <el-form-item label="Code" prop="code" v-if="false">
          <el-input v-model="dataForm.code" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="customerName">
          <el-input v-model="dataForm.customerName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard" v-if="operation == true">
          <el-input v-model="dataForm.idCard" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="dataForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="operation == true">
          <el-input v-model="dataForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" v-if="operation == false">
          <el-select v-model="dataForm.sex" placeholder="请选择">
				    <el-option
				      v-for="item in sexList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday" v-if="operation == false">
          <el-date-picker
			      v-model="dataForm.birthday"
			      type="date"
			      placeholder="选择日期"
			      format="yyyy 年 MM 月 dd 日"
      			value-format="yyyy-MM-dd"
      			style="width:193px">
			    </el-date-picker>
        </el-form-item>
        <el-form-item label="会员等级" prop="userType" v-if="operation == false">
          <el-select v-model="dataForm.userType" clearable placeholder="请选择">
				    <el-option
				      v-for="item in UserType"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
        </el-form-item>
        <el-form-item label="持卡类型" prop="cardType" v-if="operation == false">
          <el-select v-model="dataForm.cardType" clearable placeholder="请选择">
				    <el-option
				      v-for="item in CardType"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
        </el-form-item>
        <el-form-item label="客户来源" prop="clientSource" v-if="false">
          <el-select v-model="dataForm.clientSource" placeholder="请选择">
				    <el-option
				      v-for="item in ClientSource"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
        </el-form-item>
        <el-form-item label="住址" prop="address" v-if="operation == false">
          <el-input v-model="dataForm.address" auto-complete="off"></el-input>
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
import KtTable from "@/views/core/kttable";
import KtButton from "@/views/core/ktbutton";
import ToolButton from "@/views/core/toolbutton";
import TableColumnFilterDialog from "@/views/core/tablecolumnfilterdialog";
import { formatDate } from "@/utils/datetime";

export default {
  components: {
    PopupTreeInput,
    KtTable,
    ToolButton,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
  	var checkPhone = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请输入手机号'));
      }
      setTimeout(() => {
        if(!(/^1(3[0-9]|5[189]|8[6789])[0-9]{8}$/.test(value))) {
          callback(new Error('手机号格式不正确'));
        }else{
          callback();
        }
      },500);
    };
    var checkID = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请输入身份证号'));
      }
      setTimeout(() => {
        if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
          callback(new Error('身份证号格式不正确'));
        }else{
          callback();
        }
      },500);
    };
    return {
      tableTheme: this.$store.state.app.tableTheme,
      filters: {
        name: "",
        UserType:"",
        CardType:"",
        ClientSource:""
      },
      columns: [],
      filterColumns: [],
      pageResult: {},
      operation: false, // true:新增, false:编辑   ResetPass:重置密码
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        customerName: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
        idCard: [{ validator: checkID,required: true, trigger: "blur" }],
        phone: [{  validator: checkPhone,required: true, trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birthday: [{ required: true, message: "请选择出生日期", trigger: "blur" }],
        clientSource: [{ required: true, message: "请选择客户来源", trigger: "blur" }],
      },
      //新增编辑界面数据
      dataForm: {
        code: "",
        customerName: "",
        sex: "",
        age: "",
        codeNumber: "",
        idCard: "",
        phone: "",
        address: "",
        userType: "",
        cardType: "",
        clientSource: "",
        birthday: "",
        password:""
      },
      UserType:[],    		//会员等级列表
      CardType:[],				//客户持卡类型列表
      ClientSource:[],		//客户来源列表
      
      sexList:[
      	{
      		key:1,
      		value:"男"
      	},
      	{
      		key:2,
      		value:"女"
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
      this.pageRequest.UserType = this.filters.UserType;
      this.pageRequest.CardType = this.filters.CardType;
      this.pageRequest.ClientSource = this.filters.ClientSource;
      this.$api.customer.findPage(this.pageRequest)       
      .then(res => {
        this.pageResult = res; 
        for(let i in this.pageResult.items){
        	if(this.pageResult.items[i].sex == 1){
        		this.pageResult.items[i].sexCh = "男";
        	}else if(this.pageResult.items[i].sex == 2){
        		this.pageResult.items[i].sexCh = "女";
        	}
        	for(let j in this.UserType){       		
        		if(this.pageResult.items[i].userType == this.UserType[j].key){
        			this.pageResult.items[i].userTypeCh = this.UserType[j].value;
        		}
        	}
        	for(let j in this.CardType){       		
        		if(this.pageResult.items[i].cardType == this.CardType[j].key){
        			this.pageResult.items[i].cardTypeCh = this.CardType[j].value;
        		}
        	}
        	for(let j in this.ClientSource){       		
        		if(this.pageResult.items[i].clientSource == this.ClientSource[j].key){
        			this.pageResult.items[i].clientSourceCh = this.ClientSource[j].value;
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
      } else if ($event == "handleReset"){
      	this.handleReset();
      } else if ($event == "handlePush"){
//    	const { href } = this.$router.resolve({
//			    name: "www.baidu.com",
//			    query: {
//			        name: scc
//			    }
//				});
//				window.open(href, '_blank');
				window.open("http://www.baidu.com",'_blank')
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
        this.$api.customer.batchDelete(params)
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
        customerName: "",
        sex: "",
        age: "",
        codeNumber: "",
        idCard: "",
        phone: "",
        address: "",
        userType: "",
        cardType: "",
        clientSource: "",
        birthday: "",
        password:""
      };
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
    },
    // 重置密码
    handleReset(){
    	let selectData = this.$refs.kttable.selections;
    	if (selectData.length != 1) {
        this.$message({ message: "请选择一条数据后编辑", type: "error" });
        return;
      }
    	this.$confirm('是否对当前客户的密码进行重置？密码重置后为身份证号后六位！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      	let params = [];
      	params.push({ ID: selectData[0].code });
      	this.ResetPassword(params);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            if(params.code == ""){
            	delete params.code;
            	delete params.sex;
            	delete params.age;
            	delete params.codeNumber;
            	delete params.address;
            	delete params.userType;
            	delete params.cardType;
            	delete params.clientSource;
            	delete params.birthday;
            	this.$api.customer.CreateCustomer(params)
              .then(res => {
                this.dialogVisible = false;
                this.$message({ message: "操作成功", type: "success" });
                this.$refs["dataForm"].resetFields();
                this.findPage(null);
              })
              .finally(res => {
                this.editLoading = false;
              })
            }else{
            	params.customerCode=params.code;
            	delete params.code;
            	delete params.age;
            	delete params.codeNumber;
            	delete params.idCard;
            	delete params.sexCh;
            	delete params.userTypeCh;
            	delete params.cardTypeCh;
            	delete params.clientSourceCh;
            	delete params.password;
            	delete params.createDate;
            	this.$api.customer.UpdateCustomer(params)
              .then(res => {
                this.dialogVisible = false;
                this.$message({ message: "操作成功", type: "success" });
                this.$refs["dataForm"].resetFields();
                this.findPage(null);
              })
              .finally(res => {
                this.editLoading = false;
              })
            }            
          })
        }
      })
    },
    //重置密码
    ResetPassword(ID){
    	this.loading = true;
    	this.$api.customer.ResetPassword(ID)
      .then(res => {
      	this.$message({
          type: 'success',
          message: '重置密码成功'
        });
      })
      .finally(res => {
        this.loading = false;
      });
    },
    //获取会员等级
    GetUserType(){
    	this.loading = true;
      this.$api.customer.GetUserType()
      .then(res => {
      	this.UserType=res.items;
      	this.GetUserCardType();
      })
      .finally(res => {
        this.loading = false;
      });
    },
    //获取金银卡
    GetUserCardType(){
    	this.loading = true;
      this.$api.customer.GetUserCardType()
      .then(res => {
      	this.CardType=res.items;      	
      	this.GetUserSourceType();  	
      })
      .finally(res => {
        this.loading = false;
      });
    },
    //获取客户来源
    GetUserSourceType(){
    	this.loading = true;
      this.$api.customer.GetUserSourceType()
      .then(res => {
      	this.ClientSource=res.items;
      	this.findPage(null);
      })
      .finally(res => {
        this.loading = false;
      });
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
        { prop: "customerName", label: "姓名", minWidth: 100 },
        { prop: "sexCh", label: "性别", minWidth: 80 },
        { prop: "age", label: "年龄", minWidth: 80 },
        { prop: "codeNumber", label: "账号", minWidth: 120 },
        { prop: "idCard", label: "身份证号", minWidth: 120 },
        { prop: "phone", label: "手机号", minWidth: 120 },
        { prop: "userTypeCh", label: "会员等级", minWidth: 100 , },
        { prop: "cardTypeCh", label: "持卡类型", minWidth: 100 },
        { prop: "clientSourceCh", label: "客户来源", minWidth: 120 },
      ];
      this.filterColumns = this.columns;
    }
  },
  created(){
  	this.GetUserType();  	
  },
  mounted() {  	    
  	this.initColumns();
  }
};
</script>

<style scoped>
</style>

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
          <el-input v-model="filters.name" @keyup.enter.native="findPage(null)" placeholder="设备名称"></el-input>
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
    <kttableEnhance v-if="showhide" ref="kttable" :headerAlign="this.tableTheme.headerAlign" :align="this.tableTheme.align" :stripe="this.tableTheme.stripe" :size="this.tableTheme.size" :border="this.tableTheme.border" :data="pageResult" :columns="filterColumns" @findPage="findPage"></kttableEnhance>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="this.tableTheme.size" label-position="right">
        <el-form-item label="Code" prop="equipmentTypeCode" v-if="false">
          <el-input v-model="dataForm.equipmentTypeCode" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="dataForm.equipmentName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示形式" prop="type">
          <el-select v-model="dataForm.type" placeholder="请选择">
				    <el-option
				      v-for="item in OtherTypeList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
        </el-form-item>        
        <el-form-item label="图片" prop="figureUrl">
          <UpLoad @listenToChildEvent="listenToChildEvent" :ImgUrl="ImgUrl"></UpLoad>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
        	<el-input-number v-model="dataForm.sort" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="this.tableTheme.size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="this.tableTheme.size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    
    <!--新增编辑界面-->
    <el-dialog :title="dataForm.equipmentName" width="40%" :visible.sync="dialogVisible2" :close-on-click-modal="false">
      <el-form v-for="(scc,index) in EquipmentItemList" :model="EquipmentItemList[index]" :rules="dataFormRules2" ref="dataForm2" :key="index" style="background: #f4f4f4;padding:20px;box-sizing: border-box;margin-bottom:20px;display: flex;" label-width="80px"  label-position="right">
        <div style="width:500px">
	        <el-form-item label="equipmentItemCode" prop="equipmentItemCode" v-if="false">
	          <el-input v-model="scc.equipmentItemCode" :disabled="true" auto-complete="off"></el-input>
	        </el-form-item>
	        <el-form-item label="equipmentTypeCode" prop="equipmentTypeCode" v-if="false">
	          <el-input v-model="scc.equipmentTypeCode" :disabled="true" auto-complete="off"></el-input>
	        </el-form-item>
	        <el-form-item label="项目名称" prop="itemName" style="margin-top:10px;">
	          <el-input v-model="scc.itemName" auto-complete="off"  size="small"></el-input>
	        </el-form-item>
	        <el-form-item label="测量单位" prop="unit" style="margin-top:10px;">
	          <el-input v-model="scc.unit" auto-complete="off"  size="small"></el-input>
	        </el-form-item>
	        <el-form-item label="参考范围" prop="refer" style="margin-top:10px;">
	          <el-input v-model="scc.refer" auto-complete="off"  size="small"></el-input>
	        </el-form-item>
	        <el-form-item label="低值" prop="lowRefer" style="margin-top:10px;">
	          <el-input v-model="scc.lowRefer" auto-complete="off"  size="small"></el-input>
	        </el-form-item>
	        <el-form-item label="高值" prop="highRefer" style="margin-top:10px;">
	          <el-input v-model="scc.highRefer" auto-complete="off"  size="small"></el-input>
	        </el-form-item>
        </div>
        <div style="display: flex;flex-direction: column;align-items: flex-start;margin-left:20px;">
        	<el-button type="success" size="mini" @click.native="ClickAddItem(index)">添加一项</el-button>
        	<el-button type="danger" size="mini" style="margin-left:0;margin-top:10px;" @click.native="ClickDeleteItem(index)">删除本项</el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="this.tableTheme.size" @click.native="dialogVisible2 = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="this.tableTheme.size" type="primary" @click.native="submitForm2()" :loading="editLoading">{{$t('action.submit')}}</el-button>
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
      dialogVisible2:false, // 分配界面是否显示
      editLoading: false,
      dataFormRules: {
      	equipmentName: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择海报类型", trigger: "blur" }],
      },
      dataFormRules2: {
      	itemName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
      	unit: [{ required: true, message: "请输入测量单位", trigger: "blur" }]
      },
      //新增编辑界面数据
      dataForm: {
        equipmentTypeCode: "",
        equipmentName: "",
        remark: "",
        type: '',
        figureUrl:'',
        sort:0,
      },
      ImgLink:'',        //获取请求地址
      ImgUrl: "",        //图片
      OtherTypeList:[],  //设备类型列表
      EquipmentItemList:[], //设备对应项目列表
      
      showhide:false
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
      this.$api.devicetype.findPage(this.pageRequest)       
      .then(res => {
        this.pageResult = res; 	
        for(let i in this.pageResult.items){
        	for(let j in this.OtherTypeList){
        		if(this.pageResult.items[i].type == this.OtherTypeList[j].key){
        			this.pageResult.items[i].typeName = this.OtherTypeList[j].value;
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
      } else if ($event == "handleAssign") {
        this.handleAssign();
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
          params.push({ ID: selectData[i].equipmentTypeCode });
        }
        this.loading = true;
        this.$api.devicetype.batchDelete(params)
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
        equipmentTypeCode: "",
        equipmentName: "",
        remark: "",
        type: 1,
        figureUrl:'',
        sort:0,
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
      this.ImgUrl=this.ImgLink.split("api")[0]+this.dataForm.figureUrl;
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.devicetype.save(params)
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
    //分配
    handleAssign(){
    	let selectData = this.$refs.kttable.selections;
      if (selectData.length != 1) {
        this.$message({ message: "请选择一条数据后分配", type: "error" });
        return;
      }
      this.dataForm = Object.assign({}, selectData[0]);
      this.GetEquipmentItem(this.dataForm.equipmentTypeCode)
    },
    //添加项目
    ClickAddItem(index){
    	let equipmentItem = {
  			equipmentItemCode: "",
				equipmentTypeCode: this.EquipmentItemList[index].equipmentTypeCode,
				highRefer: "",
				itemName: "",
				lowRefer: "",
				refer: "",
				unit: ""
  		};
    	this.EquipmentItemList.splice(index+1, 0, equipmentItem);    	
    },
    //删除项目提示
    ClickDeleteItem(index){
    	this.$confirm("确认删除该项目吗？", "提示", {}).then(() => {        
        let params = [];
        if(this.EquipmentItemList[index].equipmentItemCode){
        	params.push({ID:this.EquipmentItemList[index].equipmentItemCode})
        } 
        let TypeCode = this.EquipmentItemList[index].equipmentTypeCode;
        this.DeleteEquipmentItem(params);        
        this.EquipmentItemList.splice(index, 1);
        if(this.EquipmentItemList.length == 0){
	  			let equipmentItem = {
		  			equipmentItemCode: "",
						equipmentTypeCode: TypeCode,
						highRefer: "",
						itemName: "",
						lowRefer: "",
						refer: "",
						unit: ""
		  		};
    			this.EquipmentItemList.push(equipmentItem);
    		}
     	})    	
    },
    //删除项目
    DeleteEquipmentItem(params){
    	this.loading = true;
      this.$api.devicetype.DeleteEquipmentItem(params)
      .then(res => {
        this.$message({ message: "删除成功", type: "success" });
        this.findPage(null);
      })
      .finally(res => {
        this.loading = false;
      })
    },
    //分配提交
    submitForm2(){
    	let lsnum = 0;
    	for(let i=0;i<this.EquipmentItemList.length;i++){
    		this.$refs.dataForm2[i].validate(valid => {
    			if (valid) {
    				lsnum = lsnum + 1;
    			}
       	})
    	}
    	if(lsnum == this.EquipmentItemList.length){
    		this.$confirm("确认提交吗？", "提示", {}).then(() => {
          this.editLoading = true;
          let params = Object.assign([], this.EquipmentItemList);
          this.$api.devicetype.SaveEquipmentItem(params)
            .then(res => {
              this.dialogVisible2 = false;
              this.$message({ message: "操作成功", type: "success" });
              for(let i in this.$refs["dataForm2"]){
              	this.$refs["dataForm2"][i].resetFields();
              }             
              this.findPage(null);
            })
            .finally(res => {
              this.editLoading = false;
            })
        })
    	}
    },
    //上传
    listenToChildEvent(base64){
    	this.ImgUrl=base64;
    	this.editLoading = true;
    	this.$api.upload.UploadImgByBase64(StingBase64(base64),1)
	  	.then( data => {
	  		this.dataForm.figureUrl=data;  		
	  	})
	  	.finally(res => {
        this.editLoading = false;
      })
    },
    //设备显示形式查询
    GetOtherType(){
    	this.editLoading = true;
    	this.$api.devicetype.GetOtherType()
	  	.then( data => { 
	  		this.OtherTypeList = data.items;	
	  		this.showhide = true;	  		
	  	})
	  	.finally(res => {
        this.editLoading = false;
      })
    },
    //设备对应项目列表
    GetEquipmentItem(code){
    	this.editLoading = true;
    	this.$api.devicetype.GetEquipmentItem(code)
	  	.then( data => { 
	  		this.EquipmentItemList = data.items;	
	  		if(this.EquipmentItemList.length == 0){
	  			let equipmentItem = {
		  			equipmentItemCode: "",
						equipmentTypeCode: code,
						highRefer: "",
						itemName: "",
						lowRefer: "",
						refer: "",
						unit: ""
		  		};
    			this.EquipmentItemList.push(equipmentItem);
	  		}
	  		this.dialogVisible2=true;
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
        { prop: "equipmentName", label: "设备名称", minWidth: 120 },       
        { prop: "typeName", label: "显示形式", minWidth: 80 },
        { prop: "sort", label: "排序", minWidth: 60 },
        { prop: "remark", label: "备注", minWidth: 120 },
        { prop: "createDate", label: "创建时间", minWidth: 80 , formatter: this.dateFormat},
        { prop: "figureUrl", label: "设备配图", minWidth: 120 , special: "img_figure"}
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
  	this.GetOtherType(); 	
  },
  mounted() {  	
  	this.initColumns();  	
  }
};
</script>

<style scoped>
</style>

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
          <el-input v-model="filters.name" @keyup.enter.native="findPage(null)" placeholder="体检卡名称"></el-input>
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
    <kt-table permsEdit="sys:user:edit" permsDelete="sys:user:delete" :headerAlign="this.tableTheme.headerAlign" :align="this.tableTheme.align" :stripe="this.tableTheme.stripe" :size="this.tableTheme.size" :border="this.tableTheme.border" :data="pageResult" :columns="filterColumns" @findPage="findPage"></kt-table>
    <!--新增编辑界面-->
     <!--<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="this.tableTheme.size" label-position="right">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="operatorName">
          <el-input v-model="dataForm.operatorName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="loginName">
          <el-input v-model="dataForm.loginName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="deptName">
          <popup-tree-input :data="deptData" :props="deptTreeProps" :prop="dataForm.deptName" :nodeKey="''+dataForm.deptID" :currentChangeHandle="deptTreeCurrentChangeHandle"></popup-tree-input>
        </el-form-item>
        <el-form-item label="角色" prop="userRoles" v-if="!operation">
          <el-select v-model="dataForm.userRoles" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in roles" :key="item.id" :label="item.rolesName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="this.tableTheme.size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="this.tableTheme.size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import KtTable from "@/views/core/kttable";
import KtButton from "@/views/core/ktbutton";
import ToolButton from "@/views/core/toolbutton";
import TableColumnFilterDialog from "@/views/core/tablecolumnfilterdialog";
import { format } from "@/utils/datetime";
export default {
  components: {
    PopupTreeInput,
    KtTable,
    KtButton,
    ToolButton,
    TableColumnFilterDialog
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
        loginName: [
          { required: true, message: "请输入体检卡名称", trigger: "blur" }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: null,
        operatorName: "",
        loginName: "",
        deptID: 1,
        deptName: "",
        userRoles: []
      },
      deptData: [],
      deptTreeProps: {
        label: "deptName",
        children: "children"
      },
      roles: []
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      this.pageRequest.filter = this.filters.name;
      this.$api.card
        .findPage(this.pageRequest)
        .then(res => {
          this.pageResult = res;
          //this.findUserRoles();
        })
        .then(data != null ? data.callback : "");
    },
    // 加载用户角色信息
//  findUserRoles: function() {
//    var _this = this;
//    this.$api.sys_role.findAll().then(res => {
//      // 加载角色集合
//      var roleMap = res.items.map(item => {
//        return {
//          rolesID: item.rolesID,
//          rolesName: item.rolesName
//        };
//      });
//      _this.roles = roleMap;
//    });
//  },
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
    //批量删除
    handleDelete: function(data) {
      this.$api.card
        .batchDelete(data.params)
        .then(data != null ? data.callback : "");
    },
    // // 显示新增界面
    // handleAdd: function() {
    //   this.dialogVisible = true;
    //   this.operation = true;
    //   this.dataForm = {
    //     code: null,
    //     operatorName: "",
    //     loginName: "",
    //     deptID: 1,
    //     deptName: "",
    //     userRoles: []
    //   };
    // },
    // // 显示编辑界面
    // handleEdit: function(params) {
    //   this.dialogVisible = true;
    //   this.operation = false;
    //   this.dataForm = Object.assign({}, params.row);
    //   let userRoles = [];
    //   for (let i = 0, len = params.row.userRoles.length; i < len; i++) {
    //     userRoles.push(params.row.userRoles[i].id);
    //   }
    //   this.dataForm.userRoles = userRoles;
    // },
    // // 编辑
    // submitForm: function() {
    //   this.$refs.dataForm.validate(valid => {
    //     if (valid) {
    //       this.$confirm("确认提交吗？", "提示", {}).then(() => {
    //         this.editLoading = true;
    //         let params = Object.assign({}, this.dataForm);
    //         let userRoles = [];
    //         for (let i = 0, len = params.userRoles.length; i < len; i++) {
    //           let userRole = {
    //             ID: params.userRoles[i]
    //           };
    //           userRoles.push(userRole);
    //         }
    //         params.userRoles = userRoles;
    //         this.$api.sys_user
    //           .save(params)
    //           .then(res => {
    //             this.dialogVisible = false;
    //             this.$message({ message: "操作成功", type: "success" });
    //             this.$refs["dataForm"].resetFields();
    //             this.findPage(null);
    //           })
    //           .finally(res => {
    //             this.editLoading = false;
    //           });
    //       });
    //     }
    //   });
    // },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
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
        { prop: "cardName", label: "卡名称", minWidth: 120 },
        { prop: "imageUrl", label: "路径", minWidth: 120 },
        { prop: "createDate", label: "时间", minWidth: 120 },
        { prop: "cardStatus", label: "状态", minWidth: 100 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    }
  },
  mounted() {
    this.initColumns();
  }
};
</script>

<style scoped>
</style>

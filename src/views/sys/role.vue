<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar left">
      <el-form :inline="true" :model="filters" :size="this.tableTheme.size" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="filters.rolesName" @keyup.enter.native="findPage(null)" placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="icon icon-chaxun"  :size="this.tableTheme.size" type="primary" @click="findPage(null)">{{$t('action.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar right">
      <el-form :inline="true" :size="this.tableTheme.size" @submit.native.prevent>
        <el-form-item>
          <el-button icon="icon icon-xinzeng" type="primary" @click="handleAdd"> {{$t('action.add')}}</el-button>
          <el-button icon="icon icon-bianji" @click="handleEdit"> {{$t('action.edit')}}</el-button>
          <el-button icon="icon icon-delete" type="danger" @click="handleDelete"> {{$t('action.delete')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table ref="kttable" :align="this.tableTheme.align" :border="this.tableTheme.border"  :highlightCurrentRow="true" :stripe="false" :data="pageResult" :columns="columns" @handleCurrentChange="handleRoleSelectChange" @findPage="findPage">
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="this.tableTheme.size">
        <el-form-item label="ID" prop="rolesID" v-if="false">
          <el-input v-model="dataForm.rolesID" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="rolesName">
          <el-input v-model="dataForm.rolesName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注 " prop="rolesRemark">
          <el-input v-model="dataForm.rolesRemark" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="this.tableTheme.size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="this.tableTheme.size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <!--角色菜单，表格树内容栏-->
    <div class="menu-container" :v-if="true">
      <div class="menu-header">
        <span><B>角色菜单授权</B></span>
      </div>
      <el-tree :data="menuData" size="mini" show-checkbox node-key="menuID" :props="defaultProps" style="width: 100%;pading-top:20px;" ref="menuTree" :render-content="renderContent" v-loading="menuLoading" :element-loading-text="$t('action.loading')" :check-strictly="true" @check-change="handleMenuCheckChange">
      </el-tree>
      <div style="margin-top:20px;">
        <div class="left">
          <el-checkbox v-model="checkAll" @change="handleCheckAll" :disabled="this.selectRole.rolesID == null"><b>全选</b></el-checkbox>
        </div>
        <div class="right">
          <el-button icon="icon icon-zhongzhi" :size="this.tableTheme.size" type="primary" @click="resetSelection" :disabled="this.selectRole.rolesID == null"> {{$t('action.reset')}}</el-button>
          <el-button icon="icon icon-tijiao" :size="this.tableTheme.size" type="primary" @click="submitAuthForm" :disabled="this.selectRole.rolesID == null" :loading="authLoading"> {{$t('action.submit')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KtTable from "@/views/core/kttable";
import KtButton from "@/views/core/ktbutton";
import TableTreeColumn from "@/views/core/tabletreecolumn";
import { format } from "@/utils/datetime";
export default {
  components: {
    KtTable,
    KtButton,
    TableTreeColumn
  },
  data() {
    return {
      tableTheme: this.$store.state.app.tableTheme,
      filters: {
        rolesName: ""
      },
      columns: [
        { prop: "rolesID", label: "编号", minWidth: 50 },
        { prop: "rolesName", label: "角色名", minWidth: 120 },
        { prop: "rolesRemark", label: "备注", minWidth: 120 },
      ],
      pageRequest: { page: 1, limit: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        rolesName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {
        rolesID: null,
        rolesName: "",
        rolesRemark: ""
      },
      selectRole: {},
      menuData: [],
      menuSelections: [],
      menuLoading: false,
      authLoading: false,
      checkAll: false,
      currentRoleMenus: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      } else {
        this.pageRequest.page = 1;
      }
      this.pageRequest.filter = this.filters.rolesName;
      this.$api.sys_role
        .findPage(this.pageRequest)
        .then(res => {
          this.pageResult = res;
          this.findTreeData();
        })
        .then(data != null ? data.callback : "");
    },
    // 批量删除
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
          params.push({ id: selectData[i].rolesID });
        }
        this.loading = true;
        this.$api.sys_role
          .batchDelete(params)
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
        rolesID: 0,
        rolesName: "",
        rolesRemark: ""
      };
    },
    // 显示编辑界面
    handleEdit: function(params) {
      let selectData = this.$refs.kttable.selections;
      if (selectData.length != 1) {
        this.$message({ message: "请选择一条数据后编辑", type: "error" });
        return;
      }
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, selectData[0]);
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.sys_role
              .saveRole(params)
              .then(res => {
                this.$message({ message: "操作成功", type: "success" });
                this.$refs["dataForm"].resetFields();
                this.findPage(null);
              })
              .finally(res => {
                this.editLoading = false;
                this.dialogVisible = false;
              });
          });
        }
      });
    },
    // 获取数据
    findTreeData: function() {
      this.menuLoading = true;
      this.$api.sys_menu.findMenuTree().then(res => {
        this.menuData = res.items;
        this.menuLoading = false;
      });
    },
    // 角色选择改变监听
    handleRoleSelectChange(val) {
      if (val == null || val.val == null) {
        return;
      }
      this.selectRole = val.val;
      this.$api.sys_role.findRoleMenus(val.val.rolesID).then(res => {
        this.currentRoleMenus = res.items;
        this.$refs.menuTree.setCheckedNodes(res.items);
      });
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        let parentId = data.parentId;
        this.$refs.menuTree.setChecked(parentId, true, false);
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, false);
          });
        }
      }
    },
    // 重置选择
    resetSelection() {
      this.checkAll = false;
      this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        let allMenus = [];
        this.checkAllMenu(this.menuData, allMenus);
        this.$refs.menuTree.setCheckedNodes(allMenus);
      } else {
        this.$refs.menuTree.setCheckedNodes([]);
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu);
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus);
        }
      });
    },
    // 角色菜单授权提交
    submitAuthForm() {
      let rolesID = this.selectRole.rolesID;
      if ("admin" == this.selectRole.rolesName) {
        this.$message({
          message: "超级管理员拥有所有菜单权限，不允许修改！",
          type: "error"
        });
        return;
      }
      this.authLoading = true;
      let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true);
      let roleMenus = [];
      for (let i = 0, len = checkedNodes.length; i < len; i++) {
        let roleMenu = { RoleID: rolesID, MenuID: checkedNodes[i].menuID };
        roleMenus.push(roleMenu);
      }
      this.$api.sys_role
        .saveRoleMenus(roleMenus)
        .then(res => {
          this.$message({ message: "操作成功", type: "success" });
        })
        .finally(() => {
          this.authLoading = false;
        });
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="column-container">
          <span style="text-algin:center;margin-right:80px;width:100px;display:-webkit-inline-box;">
            {data.menuName}
          </span>
          <span style="text-algin:center;margin-right:80px;width:100px;display:-webkit-inline-box;">
            <el-tag
              type={
                data.menuType === 1
                  ? ""
                  : data.menuType === 2
                  ? "success"
                  : "info"
              }
              size="small"
            >
              {data.menuType === 0
                ? "目录"
                : data.menuType === 1
                ? "菜单"
                : "按钮"}
            </el-tag>
          </span>
          <span style="text-algin:center;margin-right:80px;width:100px;;display:-webkit-inline-box;">
            {" "}
            <i class={data.menuImg} />
          </span>
          <span style="text-algin:center;margin-right:80px;width:100px;;display:-webkit-inline-box;">
            {data.parentName ? data.parentName : "顶级菜单"}
          </span>
          <span style="text-algin:center;margin-right:80px;width:100px;display:-webkit-inline-box;">
            {data.navigateUrl ? data.navigateUrl : "\t"}
          </span>
        </div>
      );
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    }
  },
  mounted() {}
};
</script>
<style scoped>
.menu-container {
  margin-top: 10px;
}
.menu-header {
  padding-left: 8px;
  padding-bottom: 5px;
  text-align: left;
  font-size: 16px;
  color: rgb(20, 89, 121);
}
</style>

<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar left">
      <el-form :inline="true" :model="filters" :size="this.tableTheme.size" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="filters.deptName" @keyup.enter.native="findTreeData()" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="icon icon-chaxun" :size="this.tableTheme.size" type="primary" @click="findTreeData()">{{$t('action.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar right">
      <tool-button ref="toolbutton" @buttonClick="buttonClick"></tool-button>
    </div>
    <!--表格树内容栏-->
    <el-table ref="kttable" :data="tableTreeDdata" :stripe="this.tableTheme.stripe" :size="this.tableTheme.size" :border="this.tableTheme.border" row-key="deptID" v-loading="loading" :element-loading-text="$t('action.loading')">
      <el-table-column type="selection" width="40" ></el-table-column>
      <table-tree-column prop="deptName" header-align="center" align="left" treeKey="id" label="名称">
      </table-tree-column>
      <el-table-column prop="parentName" header-align="center" :align="this.tableTheme.align" label="上级机构">
      </el-table-column>
      <el-table-column prop="sortCode" header-align="center" :align="this.tableTheme.align" label="排序" width="100">
      </el-table-column>
      <el-table-column prop="deptRemark" header-align="center" :align="this.tableTheme.align" label="备注">
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog :title="!dataForm.roleID ? '新增' : '修改'" width="40%" :visible.sync="dialogVisible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()" label-width="80px" :size="this.tableTheme.size" >
        <el-form-item label="名称" prop="deptName">
          <el-input v-model="dataForm.deptName" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="上级机构" prop="parentName">
          <popup-tree-input :data="popupTreeData" :props="popupTreeProps" :prop="dataForm.parentName==null?'顶级菜单':dataForm.parentName" :nodeKey="''+dataForm.parentID" :currentChangeHandle="handleTreeSelectChange">
          </popup-tree-input>
        </el-form-item>
        <el-form-item label="排序编号" prop="sortCode">
          <el-input-number v-model="dataForm.sortCode" controls-position="right" :min="0" label="排序编号"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="deptRemark">
          <el-input v-model="dataForm.deptRemark" placeholder="名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="this.tableTheme.size" @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="this.tableTheme.size" type="primary" @click="submitForm()">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/core/ktbutton";
import ToolButton from "@/views/core/toolbutton";
import TableTreeColumn from "@/views/core/tabletreecolumn";
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";
import { format } from "@/utils/datetime";
export default {
  components: {
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip,
    ToolButton
  },
  data() {
    return {
      tableTheme: this.$store.state.app.tableTheme,
      loading: false,
      filters: {
        deptName: ""
      },
      tableTreeDdata: [],
      dialogVisible: false,
      dataForm: {
        deptID: 0,
        deptName: "",
        parentID: 0,
        parentName: "",
        sortCode: 0,
        deptRemark:""
      },
      dataRule: {
        deptName: [
          { required: true, message: "机构名称不能为空", trigger: "blur" }
        ],
        parentID: [
          { required: true, message: "上级机构不能为空", trigger: "change" }
        ]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: "deptName",
        children: "children"
      }
    };
  },
  methods: {
    // 获取数据
    findTreeData: function() {
      this.loading = true;
      this.$api.sys_dept
        .findDeptTree()
        .then(res => {
          this.tableTreeDdata = res.items;
          this.popupTreeData = this.getParentMenuTree(res.items);
        })
        .finally(res => {
          this.loading = false;
        });
    },
    // 获取上级机构树
    getParentMenuTree: function(tableTreeDdata) {
      let parent = {
        parentID: 0,
        deptID: 0,
        deptName: "顶级菜单",
        children: tableTreeDdata
      };
      return [parent];
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
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.dataForm = {
        deptID: null,
        deptName: "",
        parentID: null,
        parentName: "",
        sortCode: 0,
        deptRemark:""
      };
    },
    // 显示编辑界面
    handleEdit: function() {
      let selectData = this.$refs.kttable.selection;
      if (selectData.length != 1) {
        this.$message({ message: "请选择一条数据后编辑", type: "error" });
        return;
      }
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, selectData[0]);
    },
    // 删除
    handleDelete() {
      let selectData = this.$refs.kttable.selection;
      if (selectData.length == 0) {
        this.$message({ message: "请选择数据后删除", type: "error" });
        return;
      }
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        let params = [];
        for (var i = 0; i < selectData.length; i++) {
          params.push({ id: selectData[i].deptID });
        }
        this.loading = true;
        this.$api.sys_dept
          .batchDelete(params)
          .then(res => {
            this.$message({ message: "删除成功", type: "success" });
             this.findTreeData();
          })
          .finally(res => {
            this.loading = false;
          });
      });
    },
    // 机构树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parentID = data.deptID;
      this.dataForm.parentName = data.deptName;
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.sys_dept
              .saveDept(params)
              .then(res => {
                this.$message({ message: "操作成功", type: "success" });
                this.$refs["dataForm"].resetFields();
                this.findTreeData();
              })
              .finally(res => {
                this.dialogVisible = false;
                this.editLoading = false;
                this.loading = false;
              });
          });
        }
      });
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    }
  },
  mounted() {
    this.findTreeData();
  }
};
</script>

<style scoped>
</style>

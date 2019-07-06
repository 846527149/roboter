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
          <el-input v-model="filters.name" @keyup.enter.native="findPage(null)" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="icon icon-chaxun"
            :size="this.tableTheme.size"
            type="primary"
            @click="findPage(null)"
          >{{$t('action.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar right">
      <tool-button ref="toolbutton" @buttonClick="buttonClick"></tool-button>
    </div>
    <div class="toolbar">
      <!--表格显示列界面-->
      <table-column-filter-dialog
        ref="tableColumnFilterDialog"
        :align="this.tableTheme.align"
        :columns="columns"
        @handleFilterColumns="handleFilterColumns"
      ></table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <kt-table
      ref="kttable"
      :headerAlign="this.tableTheme.headerAlign"
      :align="this.tableTheme.align"
      :stripe="this.tableTheme.stripe"
      :size="this.tableTheme.size"
      :border="this.tableTheme.border"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    ></kt-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="this.tableTheme.size"
        label-position="right"
        style="text-align:left;"
      >
        <el-form-item label="ID" prop="buttonID" v-if="false">
          <el-input v-model="dataForm.buttonID" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="buttonName">
          <el-input
            type="text"
            maxlength="5"
            show-word-limit
            v-model="dataForm.buttonName"
            auto-complete="off"
            placeholder="按钮的显示名称，不能超过5个字"
          ></el-input>
        </el-form-item>
        <el-form-item label="事件" prop="buttonCode">
          <el-input
            type="text"
            maxlength="10"
            show-word-limit
            v-model="dataForm.buttonCode"
            auto-complete="off"
            placeholder="如：add，edit，delete等"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortCode">
          <el-input-number
            v-model="dataForm.sortCode"
            controls-position="right"
            :min="0"
            label="排序编号"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="颜色" prop="buttonType">
          <el-select v-model="dataForm.buttonType" placeholder="请选择颜色">
            <el-option label="default" value="default"></el-option>
            <el-option label="primary" value="primary"></el-option>
            <el-option label="danger" value="danger"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="buttonImg">
          <el-input
            type="text"
            maxlength="50"
            show-word-limit
            v-model="dataForm.buttonImg"
            auto-complete="off"
            placeholder="请使用iconfont 图标库"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="buttonRemak">
          <el-input
            type="textarea"
            :rows="2"
            maxlength="200"
            show-word-limit
            v-model="dataForm.buttonRemak"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :size="this.tableTheme.size"
          @click.native="dialogVisible = false"
        >{{$t('action.cancel')}}</el-button>
        <el-button
          :size="this.tableTheme.size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import KtTable from "@/views/core/kttable";
import ToolButton from "@/views/core/toolbutton";
import KtButton from "@/views/core/ktbutton";
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
      buttonList: [],
      columns: [],
      filterColumns: [],
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        buttonName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        buttonCode: [{ required: true, message: "请输入事件", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {
        buttonID: null,
        buttonName: "",
        buttonRemak: "",
        sortCode: 1,
        buttonImg: "",
        buttonCode: "",
        buttonType: "default"
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
      this.pageRequest.filter = this.filters.name;
      this.$api.sys_button
        .findPage(this.pageRequest)
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
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        buttonID: null,
        buttonName: "",
        buttonRemak: "",
        sortCode: 1,
        buttonImg: "",
        buttonCode: "",
        buttonType: "default"
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
          params.push({ id: selectData[i].buttonID });
        }
        this.loading = true;
        this.$api.sys_button
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
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.sys_button
              .save(params)
              .then(res => {
                this.dialogVisible = false;
                this.$message({ message: "操作成功", type: "success" });
                this.$refs["dataForm"].resetFields();
                this.findPage(null);
              })
              .finally(res => {
                this.editLoading = false;
              });
          });
        }
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
        { prop: "buttonID", label: "ID", minWidth: 80, hide: true },
        { prop: "buttonName", label: "名称", minWidth: 80 },
        { prop: "buttonImg", label: "图标", minWidth: 80 },
        { prop: "buttonCode", label: "事件", minWidth: 80 },
        { prop: "sortCode", label: "排序", minWidth: 40 },
        { prop: "buttonRemak", label: "备注", minWidth: 100 }
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

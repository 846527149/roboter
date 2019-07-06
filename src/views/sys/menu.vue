<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar left">
      <el-form :inline="true" :model="filters" :size="this.tableTheme.size" @submit.native.prevent>

      </el-form>
    </div>
    <div class="toolbar right">
      <el-form :inline="true" :size="this.tableTheme.size" @submit.native.prevent>
        <el-form-item>
          <el-button
            :size="this.tableTheme.size"
            icon="icon icon-xinzeng"
            type="primary"
            @click="handleAdd"
          >{{$t('action.add')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--表格树内容栏-->
    <el-table
      :data="tableTreeDdata"
      rowKey="menuID"
      stripe
      :border="this.tableTheme.border"
      :size="this.tableTheme.size"
      row-key="id"
      v-loading="loading"
      :element-loading-text="$t('action.loading')"
    >
      <table-tree-column
        prop="menuName"
        header-align="center"
        align="left"
        treeKey="menuID"
        label="名称"
      ></table-tree-column>
      <el-table-column header-align="center" :align="this.tableTheme.align" label="图标" width="100">
        <template slot-scope="scope">
          <i :class="scope.row.menuImg || ''"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        :align="this.tableTheme.align"
        label="类型"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menuType === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.menuType === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.menuType === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        :align="this.tableTheme.align"
        label="上级菜单"
      ></el-table-column>
      <el-table-column
        prop="navigateUrl"
        header-align="center"
        :align="this.tableTheme.align"
        :show-overflow-tooltip="true"
        label="菜单URL"
      ></el-table-column>
      <el-table-column
        prop="target"
        header-align="center"
        :align="this.tableTheme.align"
        width="150"
        :show-overflow-tooltip="true"
        label="事件"
      ></el-table-column>
      <el-table-column
        prop="sortCode"
        header-align="center"
        :align="this.tableTheme.align"
        label="排序"
        width="100"
      ></el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="right"
        width="280"
        :label="$t('action.operation')"
      >
        <template slot-scope="scope">
          <el-button
            icon="icon icon-fenpei"
            v-if="scope.row.menuType==1"
            :size="tableTheme.size"
            @click="handleAssign(scope.row)"
          >{{$t('action.assign')}}</el-button>
          <el-button
            icon="icon icon-bianji"
            v-if="scope.row.menuType!=2"
            :size="tableTheme.size"
            @click="handleEdit(scope.row)"
          >{{$t('action.edit')}}</el-button>
          <el-button
            icon="icon icon-delete"
            :size="tableTheme.size"
            type="danger"
            @click="handleDelete(scope.row)"
          >{{$t('action.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog :title="!dataForm.menuID ? '新增' : '修改'" width="40%" :visible.sync="dialogVisible">
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="submitForm()"
        label-width="80px"
        :size="this.tableTheme.size"
        style="text-align:left;"
      >
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="dataForm.menuType">
            <el-radio v-for="(type, index) in menuTypeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuTypeList[dataForm.menuType] + '名称'" prop="menuName">
          <el-input
            type = "text"
            maxlength="50"
            show-word-limit
            v-model="dataForm.menuName"
            :placeholder="menuTypeList[dataForm.menuType] + '名称'"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级" prop="parentName">
          <popup-tree-input
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级菜单':dataForm.parentName"
            :nodeKey="''+dataForm.parentId"
            :currentChangeHandle="handleTreeSelectChange"
          ></popup-tree-input>
        </el-form-item>
        <el-form-item v-if="dataForm.menuType === 1" label="菜单路由" prop="navigateUrl">
          <el-row>
            <el-col :span="22">
              <el-input type = "text" maxlength="200" show-word-limit v-model="dataForm.navigateUrl" placeholder="菜单路由"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light" style="padding: 10px;">
                <div slot="content">
                  <p>URL格式：</p>
                  <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。</p>
                  <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                  <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p>
                </div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="dataForm.menuType !== 2" label="排序编号" prop="sortCode">
          <el-input-number
            v-model="dataForm.sortCode"
            controls-position="right"
            :min="0"
            label="排序编号"
          ></el-input-number>
        </el-form-item>
        <el-form-item v-if="dataForm.menuType !== 2" label="菜单图标" prop="menuImg">
          <el-row>
            <el-col :span="22">
              <el-input
                type = "text"
                maxlength="50"
                show-word-limit
                v-model="dataForm.menuImg"
                v-popover:iconListPopover
                :readonly="false"
                placeholder="菜单图标名称（如：icon icon-xinzeng）"
                class="icon-list__input"
              ></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <fa-icon-tooltip/>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          :size="this.tableTheme.size"
          @click="dialogVisible = false"
        >{{$t('action.cancel')}}</el-button>
        <el-button
          :size="this.tableTheme.size"
          type="primary"
          :loading="editLoading"
          @click="submitForm()"
        >{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配按钮" width="30%" :visible.sync="assginVisble">
      <el-transfer
        filterable
        filter-placeholder="请输入按钮名称"
        :data="menuButtonData"
        :titles="['列表','已选']"
        :props="{ key: 'buttonCode',label: 'buttonName'}"
        v-model="menuButtonValue"
        style="margin:0 auto"
      ></el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button
          :size="this.tableTheme.size"
          @click="assginVisble = false"
        >{{$t('action.cancel')}}</el-button>
        <el-button
          :size="this.tableTheme.size"
          type="primary"
          :loading="editLoading"
          @click="assignSubmit()"
        >{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/core/ktbutton";
import TableTreeColumn from "@/views/core/tabletreecolumn";
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";
export default {
  components: {
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
  },
  data() {
    return {
      menuAssignValue: null,
      menuButtonValue: [],
      menuButtonData: [],
      assginVisble: false,
      tableTheme: this.$store.state.app.tableTheme,
      loading: false,
      editLoading: false,
      filters: {
        menuName: ""
      },
      tableTreeDdata: [],
      dialogVisible: false,
      menuTypeList: ["目录", "菜单"],
      dataForm: {
        menuID: null,
        menuType: 1,
        menuName: "",
        parentId: 0,
        parentName: "",
        navigateUrl: "",
        target: "",
        sortCode: 0,
        menuImg: "",
        iconList: []
      },
      dataRule: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: "menuName",
        children: "children"
      }
    };
  },
  methods: {
    // 获取数据
    findTreeData: function() {
      this.loading = true;
      this.$api.sys_menu.findMenuTree().then(res => {
        this.tableTreeDdata = res.items;
        this.loading = false;
      });
    },
    // 获取目录数据
    findCatelogTree: function() {
      this.loading = true;
      this.$api.sys_menu.findCatelogMenuTree().then(res => {
        this.popupTreeData = this.getParentMenuTree(res.items);
        this.loading = false;
      });
    },
    getButtonTree: function() {
      this.$api.sys_button.findList("").then(res => {
        this.menuButtonData = res.items;
      });
    },
    // 获取上级菜单树
    getParentMenuTree: function(tableTreeDdata) {
      let parent = {
        parentId: 0,
        menuName: "顶级菜单",
        children: tableTreeDdata
      };
      return [parent];
    },
    handleAssign: function(row) {
      this.assginVisble = true;
      this.menuAssignValue = row.menuID;
      this.$api.sys_menu.findMenuButton(this.menuAssignValue).then(res => {
        this.menuButtonValue = res.items;
      });
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.dataForm = {
        menuID: null,
        menuType: 1,
        typeList: ["目录", "菜单", "按钮"],
        menuName: "",
        parentId: 0,
        parentName: "",
        navigateUrl: "",
        target: "",
        sortCode: 0,
        menuImg: "",
        iconList: []
      };
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      Object.assign(this.dataForm, row);
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        let params = this.getDeleteIds([], row);
        this.$api.sys_menu.batchDelete(params).then(res => {
          this.findTreeData();
          this.$message({ message: "删除成功", type: "success" });
        });
      });
    },
    // 获取删除的包含子菜单的id列表
    getDeleteIds(ids, row) {
      ids.push({ id: row.menuID });
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i]);
        }
      }
      return ids;
    },
    // 菜单树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parentId = data.menuID;
      this.dataForm.parentName = data.menuName;
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    // 分配保存
    assignSubmit() {
      this.$confirm("确认提交吗？", "提示", {})
        .then(() => {
          this.editLoading = true;
          let params = {
            Array: [],
            Key: null
          };
          params.Array = this.menuButtonValue;
          params.Key = this.menuAssignValue;
          this.$api.sys_menu
            .saveMenuButton(Object.assign({}, params))
            .then(res => {
              this.$message({ message: "操作成功", type: "success" });
              this.assginVisble = false;
              this.menuAssignValue = null;
              this.findTreeData();
            })
            .finally(res => {
              this.editLoading = false;
            });
        })
        .catch(err => {});
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {})
            .then(() => {
              this.editLoading = true;
              let params = Object.assign({}, this.dataForm);
              this.$api.sys_menu
                .saveMenu(params)
                .then(res => {
                  this.$message({ message: "操作成功", type: "success" });
                  this.dialogVisible = false;
                  this.$refs["dataForm"].resetFields();
                  this.findTreeData();
                })
                .finally(res => {
                  this.editLoading = false;
                });
            })
            .catch(() => {});
        }
      });
    }
  },
  mounted() {
    this.findTreeData();
    this.findCatelogTree();
    this.getButtonTree();
  }
};
</script>

<style lang="scss" scoped>
.transfer-class .el-transfer-panel {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  display: inline-block;
  vertical-align: middle;
  width: 250px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>

<template>
  <div class="rights">
    <!-- 对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="40%">
      <el-tree
        :data="data1"
        show-checkbox
        node-key="id"
        ref="tree"
        :props="defaultProps"
        :default-expanded-keys="defaultIds"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRoles">分配</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色 和添加角色的对话框 -->
    <el-dialog
      :title="dlalogTitle"
      :visible.sync="addorchange"
      width="30%"
      @closed="closed"
    >
      <!--  -->
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--  -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addorchange = false">取 消</el-button>
        <el-button type="primary" @click="addorchangeok">确 定</el-button>
      </span>
    </el-dialog>

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <br />
    <el-button @click="add"> 添加角色 </el-button>
    <template>
      <el-table :data="data" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left">
              <p v-if="props.row.children.length === 0">暂无数据</p>
              <el-form-item>
                <el-row v-for="l1 in props.row.children" :key="l1.id">
                  <el-col :span="4">
                    <el-tag closable @close="deleteRoles(props.row, l1.id)">{{
                      l1.authroleDesc
                    }}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-row v-for="l2 in l1.children" :key="l2.id">
                      <el-col :span="4">
                        <el-tag
                          type="success"
                          closable
                          @close="deleteRoles(props.row, l2.id)"
                          >{{ l2.authName }}</el-tag
                        >
                      </el-col>
                      <el-col :span="20">
                        <el-tag
                          type="danger"
                          closable
                          v-for="l3 in l2.children"
                          :key="l3.id"
                          @close="deleteRoles(props.row, l3.id)"
                          >{{ l3.authName }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" style="width: 30%">
        </el-table-column>
        <el-table-column prop="roleDesc" label="描述" style="width: 30%">
        </el-table-column>
        <el-table-column label="操作" style="width: 30%">
          <template slot-scope="scope">
            <el-button
              @click="changeUser(scope.row)"
              size="small"
              type="primary"
              plain
              icon="el-icon-edit"
            ></el-button>
            <el-button
              @click="deleteUser(scope.row, $event)"
              size="small"
              type="danger"
              plain
              icon="el-icon-delete"
            ></el-button>
            <el-button
              size="small"
              type="success"
              plain
              icon="el-icon-check"
              @click="showAssignDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        roleDesc: "",
        roleName: "",
        id: "",
      },
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
            trigger: ["blur", "change"],
          },
        ],
        roleDesc: [
          {
            required: true,
            message: "请输入角色描述",
            trigger: ["blur", "change"],
          },
        ],
      },
      dlalogTitle: "",
      addorchange: false,
      dialogVisible: false,
      defaultIds: [],
      roleId: "",
      data: [],
      data1: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const { meta, data } = await this.$axios.get("roles");
      if (meta.status === 200) {
        this.data = data;
      }
    },
    async deleteRoles(row, rightId) {
      const { meta, data } = await this.$axios.delete(
        `roles/${row.id}/rights/${rightId}`
      );
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        row.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    async showAssignDialog(row) {
      this.dialogVisible = true;
      const { meta, data } = await this.$axios.get(`rights/tree`);
      if (meta.status === 200) {
        this.data1 = data;
      }
      const ids = [];
      row.children.forEach((l1) => {
        l1.children.forEach((l2) => {
          l2.children.forEach((l3) => {
            ids.push(l3.id);
          });
        });
      });
      this.defaultIds = ids;
      this.roleId = row.id;
      this.$refs.tree.setCheckedKeys(ids);
    },
    // 分配
    async changeRoles() {
      const ids = this.$refs.tree.getCheckedKeys();
      const halfIds = this.$refs.tree.getHalfCheckedKeys();
      const rids = [...ids, ...halfIds].join(",");
      const {
        meta,
        data,
      } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids });
      if (meta.status === 200) {
        this.$message.success("更新成功");
      }
      this.dialogVisible = false;
      this.getRoles();
    },
    closed() {
      this.$refs.ruleForm.resetFields();
    },
    add() {
      this.dlalogTitle = "添加用户";
      this.addorchange = true;
    },
    changeUser(row) {
      this.dlalogTitle = "修改用户";
      this.addorchange = true;
      console.log(row);
      this.$nextTick(() => {
        this.ruleForm.roleDesc = row.roleDesc;
        this.ruleForm.roleName = row.roleName;
        this.ruleForm.id = row.id;
      });
    },
    async addorchangeok() {
      const isAdd = this.dlalogTitle === "添加用户";
      const url = isAdd ? "roles" : `roles/${this.ruleForm.id}`;
      const method = isAdd ? "post" : "put";
      const { meta, data } = await this.$axios[method](url, this.ruleForm);
      if (meta.status === 200 || meta.status === 201) {
        this.addorchange = false;
        this.getRoles();
        this.$message.success(meta.msg);
      } else {
        this.$message.error(meta.msg);
      }
      console.log(meta, data);
    },
    async deleteUser(row, e) {
      if (e.target.nodeName === "BUTTON") {
        e.target.blur();
      }else{
        e.target.parentNode.blur
      }
      try {
        await this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { meta, data } = await this.$axios.delete(`roles/${row.id}`);
        if (meta.status === 200) {
          this.$message.success(meta.msg);
          this.getRoles();
        } else {
          this.$message.error(meta.msg);
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
  
<style>
</style>
<template>
  <div class="users">
    <!-- 添加的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input class="input1" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            class="input1"
            v-model="form.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input class="input1" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input class="input1" v-model="form.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addusersok">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改用户" :visible.sync="changeVisible" width="40%">
      <el-form
        ref="changeform"
        :model="changeform"
        label-width="80px"
        :rules="changerules"
      >
        <el-form-item label="用户名">
          <el-input
            class="input1"
            v-model="changeform.username"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input class="input1" v-model="changeform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input class="input1" v-model="changeform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeusersok">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="提示" :visible.sync="allocateDialog" width="30%">
      <el-form v-model="allocateData" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ allocateData.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="allocateData.rid" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allocateDialog = false">取 消</el-button>
        <el-button type="primary" @click="allocateOk"
          >分 配</el-button
        >
      </span>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <br />
      <el-input v-model="query" placeholder="请输入搜索内容"></el-input>
      <el-button icon="el-icon-search" circle @click="search"></el-button>
      <el-button @click="addUsers"> 添加用户 </el-button>
    </el-breadcrumb>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <el-switch
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(obj.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="obj">
          <el-button
            @click="changeUser(obj.row)"
            type="primary"
            size="small"
            plain
            icon="el-icon-edit"
          ></el-button>
          <el-button
            @click="deleteUser(obj.row.id)"
            type="danger"
            size="small"
            plain
            icon="el-icon-delete"
          ></el-button>
          <el-button
            @click="allocate(obj.row)"
            type="success"
            size="small"
            plain
            icon="el-icon-check"
            >分配角色</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  created() {
    this.ueserList();
  },
  methods: {
    async ueserList() {
      const { data, meta } = await this.$axios.get("users", {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      });
      if (meta.status === 200) {
        this.tableData = data.users;
        this.total = data.total;
      } else {
        this.$message.error(meta.msg);
      }
    },
    async sizeChange(num) {
      this.pagesize = num;
      await this.ueserList();
    },
    async currentChange(num) {
      this.pagenum = num;
      await this.ueserList();
    },
    async deleteUser(id) {
      try {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { meta, data } = await this.$axios.delete(`users/${id}`);
        if (this.tableData.length === 1 && this.pagenum > 1) {
          this.pagenum--;
        }
        this.ueserList();
      } catch (e) {}
    },
    async search() {
      this.pagenum = 1;
      await this.ueserList();
    },
    async changeState(data) {
      const res = await this.$axios.put(
        `users/${data.id}/state/${data.mg_state}`
      );
    },
    addUsers() {
      this.dialogVisible = true;
    },
    async addusersok() {
      try {
        await this.$refs.form.validate();
        const { data, meta } = await this.$axios.post("users", {
          username: this.form.username,
          password: this.form.password,
          email: this.form.email,
          mobile: this.form.mobile,
        });

        if (meta.status === 201) {
          this.$message.success("添加成功");
          this.dialogVisible = false;
        } else {
          this.$message.error(meta.msg);
          this.dialogVisible = false;
        }
      } catch (e) {}
    },
    changeUser(row) {
      this.changeVisible = true;
      this.changeform = row;
    },
    async changeusersok() {
      try {
        await this.$refs.changeform.validate();
        const { meta, data } = await this.$axios.put(
          `users/${this.changeform.id}`,
          {
            email: this.changeform.email,
            mobile: this.changeform.mobile,
          }
        );
        if (meta.status === 200) {
          this.$message.success(meta.msg);
        } else {
          this.$message.error(meta.msg);
        }
      } catch (e) {}
    },
    async allocate(row) {
      this.allocateDialog = true;
      this.allocateData.username = row.username;
      this.allocateData.id = row.id;
      const res = await this.$axios.get(`users/${row.id}`)
      this.allocateData.rid=res.data.rid === -1?'': res.data.rid
      const { meta, data } = await this.$axios.get("roles");
      if (meta.status === 200) {
        this.roles = data;
      }
    },
    async allocateOk(){
      this.allocateDialog = false
      const {meta,data} = await this.$axios.put(`users/${this.allocateData.id}`,{rid:this.allocateData.rid})
      if(meta.status===200){
        this.$message.success(meta.msg)
      }else{
        this.$message.error(meta.msg)
      }
      this.ueserList()
    }
  },
  data() {
    return {
      roles: "",
      allocateDialog: false,
      changeVisible: false,
      changeform: {},
      form: {
        username: "",
        password: "",
        email: "",
        phone: "",
      },
      allocateData: {
        username: "",
        id:"",
        rid: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["change", "blur"],
          },
          {
            min: 3,
            max: 11,
            message: "长度在 3 到 11 个字符",
            message: "长度在 3 到 11 个字符",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"],
          },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            message: "长度在 6 到 18 个字符",
            trigger: ["blur", "change"],
          },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            required: false,
            validator: function (rule, value, callback) {
              if (
                /^1[34578]\d{9}$/.test(value) == false &&
                /^1[34578]\d{9}$/.test(value) != ""
              ) {
                callback(new Error("请输入正确的手机号"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      changerules: {
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            required: false,
            validator: function (rule, value, callback) {
              if (
                /^1[34578]\d{9}$/.test(value) == false &&
                /^1[34578]\d{9}$/.test(value) != ""
              ) {
                callback(new Error("请输入正确的手机号"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      total: 0,
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 4,
      token: localStorage.getItem("token"),
    };
  },
};
</script>

<style scoped>
.el-input {
  width: 200px;
}
.input1 {
  width: 100%;
}
</style>
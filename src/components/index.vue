<template>
  <el-container class="index">
    <el-header>
      <div class="div1">我是图片</div>
      <span class="span1">商城后台管理系统</span>
      <el-button type="danger" class="fr" @click="exit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened = true
          :router = true
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-user"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/roles">
              <i class="el-icon-user"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="/rights">
              <i class="el-icon-user"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    exit() {
      this.$confirm("你是否要继续退出", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          localStorage.removeItem("token");
          this.$router.push();
          this.$message({
            type: "success",
            message: "已成功退出",
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.el-menu{
    border: 0;
}
.fr {
  float: right;
  margin-top: 10px;
}
.index {
  height: 100%;
}
.div1 {
  float: left;
}
.el-header {
  line-height: 60px;
  background-color: #d8d8d8;
  text-align: center;
}
.el-aside {
  background-color: skyblue;
}
.el-main {
  background-color: rgb(160, 159, 159);
}
.el-menu {
  height: 100%;
}
</style>
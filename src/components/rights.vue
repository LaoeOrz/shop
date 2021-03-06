
<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <br />
    <template>
      <el-table :data="data" style="width: 100%">
        <el-table-column prop="authName" label="权限名称" width="400">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="400">
        </el-table-column>
        <el-table-column prop="level" label="层级" width="400">
          <template v-slot:default="{row}">
            <p v-if="row.level === '0'">一级</p>
            <p v-if="row.level === '1'">二级</p>
            <p v-if="row.level === '2'">三级</p>
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
      data: [],
    };
  },
  created() {
    this.getRights();
  },
  methods: {
    async getRights() {
      const { data, meta } = await this.$axios.get(`rights/list`);
      if (meta.status === 200) {
        this.data = data;
      }
      console.log(this.data);
    },
  },
};
</script>

<style>
</style>
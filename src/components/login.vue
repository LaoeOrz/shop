<template>
  <div class="login">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="form"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="username">
        <el-input
          v-model="ruleForm.username"
          placeholder="请在这里填写账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          placeholder="请在这里填写密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入账号",
            trigger: ["blur", "change"],
          },
          {
            min: 3,
            max: 11,
            message: "长度在 3 到 11 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur", "change"],
          },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((value, obj) => {
        if (!value) return
        axios.post('login',this.ruleForm).then(res=>{
          const {meta,data} =res.data
          if(meta.status == 200){
            this.$message({
              message: meta.msg,
              type: "success",
              duration:1000
            });
            window.localStorage.setItem('token',data.token)
            this.$router.push('/index')
          }else{
            this.$message({
              message: meta.msg,
              type: "error",
              duration:1000
              });
          }
        })
      });
    },
    reset() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  background-color: pink;
}
.el-form {
  background-color: #fff;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  height: 500px;
  width: 800px;
  border-radius: 8px;
  padding-top: 150px;
  box-sizing: border-box;
}
.el-button:hover {
  color: green;
  border-color: black;
  background-color: skyblue;
}
.el-input {
  width: 450px;
}
</style>
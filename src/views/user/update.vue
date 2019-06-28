<template>
  <div class="app-container">
    <el-form v-loading="loading" ref="pwdFrom" :rules="loginRules" label-position="left" label-width="200px" :model="formData">
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input v-model="formData.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="formData.newPwd"></el-input>
      </el-form-item>
      <el-form-item label="重复新密码" prop="reNewPwd">
        <el-input v-model="formData.reNewPwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { update } from '@/api/user'
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('最少6个字符'))
      } else if (value.length > 25) {
        callback(new Error('最多25个字符'))
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (value !== this.formData.newPwd) {
        callback(new Error('两次密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        oldPwd: '',
        newPwd: '',
        reNewPwd: ''
      },
      loginRules: {
        oldPwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        reNewPwd: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      },
      loading: false
    }
  },
  methods: {
    onSubmit() {
      this.$refs.pwdFrom.validate(valid => {
        if (valid) {
          this.loading = true
          update({
            id: this.$store.getters.id,
            oldPass: this.formData.oldPwd,
            newPass: this.formData.newPwd
          }).then((res) => {
            const { code, message } = res
            if (code === 1) {
              this.$message({
                message: message,
                type: 'success'
              })
              this.$store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            } else {
              this.$message({
                message: message,
                type: 'error'
              })
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

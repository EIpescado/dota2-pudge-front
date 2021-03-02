<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :inline="true" :rules="rules" class="notice-form-container" label-position="left">
      <el-row>
        <el-form-item prop="title" label="标题：" class="notice-title-input">
          <el-input v-model.trim="form.title" clearable />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="type" label="类型：" class="half-form-item">
          <el-select v-model.trim="form.type" clearable>
            <el-option v-for="item in this.$store.getters.dictSelectData.system_notice_type" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item prop="expiredDate" label="失效时间：" class="half-form-item">
          <el-date-picker v-model="form.expiredDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
      </el-row>
      <!--富文本编辑器-->
      <Tinymce ref="editor" v-model="form.content" />
    </el-form>

    <el-row class="notice-form-button-container">
      <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="submitForm">
        {{ isEdit ? '保存' : '发布' }}
      </el-button>
    </el-row>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getDictSelectData } from '@/utils/common'
import { create, get, update } from '@/api/system/notice'
export default {
  name: 'ArticleDetail',
  components: { Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: { title: '', type: '', content: '', expiredDate: '' },
      submitLoading: false, submitDisabled: false, currentId: '',
      rules: {
        title: [{ required: true, message: '标题必填' }],
        type: [{ required: true, message: '类型必填' }],
        expiredDate: [{ required: true, message: '失效时间必填' }]
      }
    }
  },
  created() {
    getDictSelectData('system_notice_type').then(() => { this.loadDetail() })
  },
  methods: {
    submitForm() {
      this.submitDisabled = true
      this.submitLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            create(this.form).then(res => {
              this.cancel()
              this.$notify.success('发布公告成功')
            }).catch(() => {
              this.submitDisabled = false
              this.submitLoading = false
            })
          } else {
            update(this.currentId, this.form).then(res => {
              this.cancel()
              this.$notify.success('修改公告成功')
            }).catch(() => {
              this.submitDisabled = false
              this.submitLoading = false
            })
          }
        } else {
          this.submitDisabled = false
          this.submitLoading = false
          return false
        }
      })
    },
    draftForm() {
    },
    cancel() {
      this.$refs.form.resetFields()
      this.submitDisabled = false
      this.submitLoading = false
      this.currentId = ''
      this.$store.dispatch('tagsView/delViewAndBackToLastView', this)
    },
    loadDetail() {
      this.currentId = this.$router.currentRoute.query.id
      if (this.isEdit && this.currentId) {
        const ld = this.$loading()
        get(this.currentId).then(res => {
          this.form = res
          delete this.form.dateCreated
          this.form.timeLimitArray = [this.form.startDate, this.form.endDate]
          ld.close()
        })
      }
    }
  }
}
</script>

<style lang="scss" scope>
.app-container{
  .notice-form-container{
    .el-form-item__label{
      width: 100px;
    }
    .notice-title-input {
      width: 100%;
      .el-form-item__content { width: calc(100% - 100px);}
    }
    .half-form-item{
      .el-form-item__content{ width: 360px; }
    }
  }
  .notice-form-button-container{
    margin: 15px 0;
    .el-button{
      height: 40px;
      width: 240px;
      font-size: 16px;
    }
  }
}
</style>

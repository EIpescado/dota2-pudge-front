<template>
  <div class="notice-form-container">
    <el-form ref="form" :model="form" :inline="true" :rules="rules" class="form-container" label-position="left">

      <!--按钮-->
      <sticky :z-index="10" class-name="sub-navbar">
        <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="submitForm">
          {{ isEdit ? '保存' : '发布' }}
        </el-button>
      </sticky>

      <!--表单-->
      <div class="notice-main-container">
        <el-row>
          <el-form-item prop="title" label-width="70px" label="标题：">
            <el-input v-model.trim="form.title" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="type" label-width="70px" label="类型：">
              <el-select v-model.trim="form.type" clearable>
                <el-option v-for="item in this.$store.getters.dictSelectData.system_notice_type" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="expiredDate" label-width="100px" label="失效时间：">
              <el-date-picker v-model="form.expiredDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="content" class="form-tinymce-container">
          <Tinymce ref="editor" v-model="form.content" />
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import { getDictSelectData } from '@/utils/common'
import { create, get, update } from '@/api/system/notice'
export default {
  name: 'ArticleDetail',
  components: { Tinymce, Sticky },
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
        expiredDate: [{ required: true, message: '失效时间必填' }],
        content: [{ required: true, message: '内容必填' }]
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

<style scoped>
.notice-form-container .notice-main-container{ padding: 25px 40px; }
.notice-form-container .notice-main-container .el-row{ width:73%; }
.notice-form-container .notice-main-container .el-row >>> .el-form-item__content { width: calc(100% - 105px); }
.form-tinymce-container{
  margin-bottom: 30px;
  height: 450px;
  width: 76%;
}
</style>

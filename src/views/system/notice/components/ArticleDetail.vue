<template>
  <div class="notice-form-container">
    <el-form ref="form" :model="form" :inline="true" :rules="rules" class="form-container" label-position="left">

      <!--按钮-->
      <sticky :z-index="10" class-name="sub-navbar">
        <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="submitForm">
          {{ isEdit ? '保存' : '发布' }}
        </el-button>
        <!-- <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="draftForm">
          暂存
        </el-button> -->
      </sticky>

      <!--表单-->
      <div class="notice-main-container">
        <el-row>
          <el-form-item prop="title" label-width="70px" label="标题：">
            <el-input v-model.trim="form.title" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="type" label-width="70px" label="类型：">
              <el-select v-model.trim="form.type" clearable>
                <el-option v-for="item in this.$store.getters.dictSelectData.system_notice_type" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="timeLimitArray" label-width="70px" label="期限：">
              <date-range-picker v-model="form.timeLimitArray" value-format="yyyy-MM-dd" />
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
import DateRangePicker from '@/components/DateRangePicker'
import { getDictSelectData } from '@/utils/common'
import { create, get, update } from '@/api/system/notice'
export default {
  name: 'ArticleDetail',
  components: { Tinymce, Sticky, DateRangePicker },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: { title: '', type: '', content: '', startDate: '', endDate: '', timeLimitArray: [] },
      submitLoading: false, submitDisabled: false, currentId: '',
      rules: {
        title: [{ required: true, message: '标题必填' }],
        type: [{ required: true, message: '类型必填' }],
        timeLimitArray: [{ required: true, message: '期限必填' }],
        content: [{ required: true, message: '内容必填' }]
      }
    }
  },
  created() {
    getDictSelectData('system_notice_type', this).then(() => {
      this.loadDetail()
    })
  },
  methods: {
    submitForm() {
      this.submitDisabled = true
      this.submitLoading = true
      this.form.startDate = this.form.timeLimitArray[0]
      this.form.endDate = this.form.timeLimitArray[1]
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

<style lang="scss" scoped>
.notice-form-container {
  .notice-main-container {
    padding: 25px 40px;
    .el-row{
      width:70%;
    }
    .form-tinymce-container{
      margin-bottom: 30px;
      height: 450px;
      width: 74%;
    }
  }

}
</style>

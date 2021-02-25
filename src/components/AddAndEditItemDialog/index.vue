<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增商品' : '修改商品'" :close-on-click-modal="false" append-to-body center class="order-member-form-container" width="1000px" @close="cancel">
    <el-form ref="form" v-loading="formLoading" :inline="true" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-form-item label="型号" prop="model">
          <el-autocomplete v-model="form.model" popper-class="order-member-autocomplete" placeholder="按型号查询" :fetch-suggestions="queryItemByModel" @select="selectCommodity">
            <template slot-scope="{ item }">
              <div class="model">{{ item.model }}</div>
              <span class="other">
                {{ item.name }}
                <el-divider direction="vertical" />
                {{ item.brand }}
                <el-divider direction="vertical" />
                {{ item.unit }}
                <el-divider direction="vertical" />
                {{ item.origin }}
              </span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-autocomplete v-model.trim="form.name" popper-class="order-member-autocomplete" placeholder="按名称查询" :fetch-suggestions="queryItemByName" @select="selectCommodity">
            <template slot-scope="{ item }">
              <div class="model">{{ item.name }}</div>
              <span class="other">
                {{ item.model }}
                <el-divider direction="vertical" />
                {{ item.brand }}
                <el-divider direction="vertical" />
                {{ item.unit }}
                <el-divider direction="vertical" />
                {{ item.origin }}
              </span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-autocomplete v-model.trim="form.brand" popper-class="order-member-autocomplete" placeholder="按品牌查询" :fetch-suggestions="queryItemByBrand" @select="selectCommodity">
            <template slot-scope="{ item }">
              <div class="model">{{ item.brand }}</div>
              <span class="other">
                {{ item.model }}
                <el-divider direction="vertical" />
                {{ item.name }}
                <el-divider direction="vertical" />
                {{ item.unit }}
                <el-divider direction="vertical" />
                {{ item.origin }}
              </span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="单位" prop="unit">
          <el-select v-model.trim="form.unit" filterable clearable>
            <el-option v-for="item in this.$store.getters.dictSelectData.e_chain_unit" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number v-model="form.price" :controls="false" />
        </el-form-item>
        <el-form-item label="数量" prop="qty">
          <el-input-number v-model="form.qty" :controls="false" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="产地" prop="origin">
          <el-select v-model.trim="form.origin" filterable clearable>
            <el-option v-for="item in this.$store.getters.dictSelectData.e_chain_origin_country" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="件数" prop="packages">
          <el-input-number v-model="form.packages" :min="1" :precision="0" :controls="false" />
        </el-form-item>
        <el-form-item label="物料号" prop="pn">
          <el-input v-model.trim="form.pn" clearable />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="净重" prop="nw">
          <el-input-number v-model="form.nw" :controls="false" />
        </el-form-item>
        <el-form-item label="毛重" prop="gw">
          <el-input-number v-model="form.gw" :controls="false" />
        </el-form-item>
        <el-form-item label="PO号" prop="poNo">
          <el-input v-model.trim="form.poNo" clearable />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="供应商发票号" prop="supplierInvoice">
          <el-input v-model.trim="form.supplierInvoice" clearable />
        </el-form-item>
        <el-form-item label="特许权" prop="involveRoyalty">
          <el-radio-group v-model="form.involveRoyalty">
            <el-radio-button :label="true">是</el-radio-button>
            <el-radio-button :label="false">否</el-radio-button>
          </el-radio-group>
          <div v-if="form.involveRoyalty" class="tip-message">请在支付给供应商后30天内向海关申报缴税</div>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button slot="footer" :loading="submitLoading" :disabled="submitDisabled" type="primary" class="order-member-form-button" @click="submitOrderMemberForm">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDictSelectData } from '@/utils/common'
export default {
  name: 'AddAndEditItemDialog',
  data() {
    return {
      form: {
        id: '', model: '', name: '', brand: '', unit: '', origin: '',
        price: undefined, qty: undefined, packages: undefined, pn: '',
        nw: undefined, gw: undefined, poNo: '',
        supplierInvoice: '', involveRoyalty: ''
      },
      rules: {
        model: [{ required: true, message: '型号必填', trigger: 'change' }],
        brand: [{ required: true, message: '品牌必填', trigger: 'change' }],
        unit: [{ required: true, message: '单位必选', trigger: 'change' }],
        price: [{ required: true, message: '单价必填', trigger: 'change' }],
        qty: [{ required: true, message: '数量必填', trigger: 'change' }],
        origin: [{ required: true, message: '产地必选', trigger: 'change' }],
        involveRoyalty: [{ required: true, message: '特许权必选', trigger: 'change' }]
      },
      isAdd: true, dialog: false, formLoading: false, submitLoading: false, submitDisabled: false
    }
  },
  created() {
    // 单位下拉
    getDictSelectData('e_chain_unit')
    // 产地下拉
    getDictSelectData('e_chain_origin_country')
  },
  methods: {
    createShow() {
      this.isAdd = true
      this.dialog = true
    },
    updateShow() {
      this.isAdd = false
      this.dialog = true
    },
    cancel() {
      this.submitDisabled = false
      this.submitLoading = false
      this.$refs.form.resetFields()
      this.dialog = false
    },
    // 根据型号查询商品
    queryItemByModel(queryString, cb) {
      this.queryItem(queryString, cb, 'model')
    },
    // 根据名称查询商品
    queryItemByName(queryString, cb) {
      this.queryItem(queryString, cb, 'name')
    },
    // 根据品牌查询商品
    queryItemByBrand(queryString, cb) {
      this.queryItem(queryString, cb, 'brand')
    },
    queryItem(queryString, cb, key) {
      const items = [
        { id: 1, model: 'Amodel大三大四的就爱苏的卡的拉可适当', name: 'Aname', brand: 'Abrand', unit: '个', origin: '中国' },
        { id: 2, model: 'Bmodel', name: 'Bname', brand: 'Bbrand', unit: '台', origin: '美国' },
        { id: 3, model: 'Cmodel3', name: 'Cname', brand: 'Cbrand', unit: '台', origin: '俄罗斯' },
        { id: 4, model: 'Cmodel4', name: 'Cname', brand: 'Cbrand', unit: '台', origin: '俄罗斯' },
        { id: 5, model: 'Cmodel5', name: 'Cname', brand: 'Cbrand', unit: '台', origin: '俄罗斯' },
        { id: 6, model: 'Cmodel6', name: 'Cname', brand: 'Cbrand', unit: '台', origin: '俄罗斯' },
        { id: 7, model: 'Cmodel7', name: 'Cname', brand: 'Cbrand', unit: '台', origin: '俄罗斯' },
        { id: 8, model: 'Cmodel8', name: 'Cname', brand: 'Cbrand', unit: '台', origin: '俄罗斯' },
        { id: 9, model: 'Cmodel9', name: 'Cname', brand: 'Cbrand', unit: '台', origin: '俄罗斯' },
        { id: 10, model: 'Cmodel10', name: 'Cname', brand: 'Cbrand', unit: '台', origin: '俄罗斯' }
      ]
      setTimeout(() => {
        const results = queryString ? items.filter(item => item[key].indexOf(queryString) !== -1) : items
        // 调用 callback 返回建议列表的数据
        cb(results)
      }, 350)
    },
    selectCommodity(item) {
      this.form.model = item.model
      this.form.name = item.name
      this.form.brand = item.brand
      this.form.unit = item.unit
      this.form.origin = item.origin
    },
    submitOrderMemberForm() {
      console.log(this.form)
      this.submitDisabled = true
      this.submitLoading = true
      this.$refs.form.validate(valid => {
        this.submitDisabled = false
        this.submitLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scope>
.order-member-form-container{
  .el-form-item{
    width: 300px;
    .el-form-item__content{
      width: 200px;
    }
  }
  .el-input-number{
    width: 100%;
    .el-input__inner{
      text-align: left;
    }
  }
  .tip-message{
    color: #f0862b;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
  .order-member-form-button{
    width: 200px;
  }
}
.el-autocomplete{
  width: 200px;
}
.order-member-autocomplete {
  width: 524px !important;
  li {
    line-height: normal;
    padding: 5px;

    .model {
      overflow: hidden;
    }
    .other {
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}
</style>

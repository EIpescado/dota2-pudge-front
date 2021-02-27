<template>
  <div class="order-container">
    <!--订单表单-->
    <div class="order-form-container">
      <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="120px" label-position="right">
        <!---------------------------------------------订单信息--------------------------------------------------->
        <div class="order-info-container">
          <el-divider content-position="left">
            订单信息
          </el-divider>
          <el-alert title="带 * 号为必填项" type="info" show-icon />
          <!--境内结算方式 及 币别-->
          <el-row>
            <el-form-item label="境内结算方式:" prop="settleId">
              <el-select v-model.trim="form.settleId" filterable clearable @change="changeSettlement">
                <el-option v-for="item in settlementList" :key="item.id" :label="item.businessType + '-' +(item.accountPeriod ? item.settlementMode + '-' + item.accountPeriod : item.settlementMode)" :value="item.id">
                  <span class="left-select-option">{{ item.businessType + ' ' + item.settlementMode }}</span>
                  <span v-show="item.accountPeriod" class="right-select-option">{{ item.accountPeriod }}</span>
                </el-option>
              </el-select>
              <div v-show="businessType" class="tip-message">{{ businessType === 2 ? '海关' : '华富洋' }}开13%增值税票</div>
            </el-form-item>
            <el-form-item label="币别:" class="currency-form-item" prop="currencyId">
              <el-radio-group v-model="form.currencyId">
                <el-radio-button v-for="item in currencyArray" :key="item.id" :label="item.id">{{ item.name }}</el-radio-button>
              </el-radio-group>
              <el-link type="primary" :icon="showAllSupportCurrency ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'" class="show-more-currency" @click="showMoreCurrency" />
            </el-form-item>
          </el-row>

          <!--供应商名称 及 联系人-->
          <el-row>
            <el-form-item label="供应商名称:">
              <el-select v-model.trim="form.supplierId" filterable clearable>
                <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="供应商联系人:">
              <el-select v-model.trim="form.supplierContactId" filterable clearable>
                <el-option v-for="item in supplierContactList" :key="item.id" :label="item.name + ' ( ' + (item.tel ? item.tel + ' / ' + item.phone : item.phone) + ' )'" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-row>

          <!--双抬头 指定报关合同号-->
          <el-row v-show="businessType && businessType === 2">
            <el-form-item label="指定报关合同号:">
              <el-radio-group v-model="form.appointContractNo">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
              </el-radio-group>
              <div class="tip-message">报关合同号为报关专用，如需填写请联系商务专员。</div>
            </el-form-item>
            <el-form-item v-show="form.appointContractNo" label="指定报关合同号:">
              <el-input v-model.trim="form.contractNo" />
            </el-form-item>
          </el-row>
        </div>

        <!---------------------------------------------商品信息--------------------------------------------------->
        <div class="order-member-container">
          <el-divider content-position="left">商品信息</el-divider>
          <el-row class="order-member-button-container">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showCreateItemDialog">新增商品</el-button>
            <el-button type="primary" size="mini" icon="el-icon-sold-out" @click="showImportItemDialog">导入商品</el-button>
            <el-button :disabled="!memberSelection || memberSelection.length !== 1" type="primary" size="mini" icon="el-icon-edit" @click="showEditItemDialog">修改商品</el-button>
            <el-button :disabled="!memberSelection || memberSelection.length === 0" type="primary" size="mini" icon="el-icon-delete" @click="deleteMembers">删除商品</el-button>
          </el-row>
          <!--商品列表-->
          <el-table ref="table" :data="form.members" highlight-current-row class="order-member-table-container" @selection-change="handleOrderMemberSelectionChange">
            <el-table-column type="selection" width="45" />
            <el-table-column label="商品型号" prop="itemModel" width="350">
              <template slot-scope="{row}">
                <el-tooltip v-show="row.gs" effect="light">
                  <div slot="content" class="tooltip-content">
                    {{ '关税率' + row.gs + ( row.zjgs ? ',包含加征关税' + row.zjgs : '') }}
                  </div>
                  <svg-icon icon-class="tariff" class-name="tip-icon" />
                </el-tooltip>
                <el-tooltip v-show="row.involveRoyalty" effect="light">
                  <div slot="content" class="tooltip-content">
                    此项涉及特许权使用费
                  </div>
                  <svg-icon icon-class="involveRoyalty" class-name="tip-icon" />
                </el-tooltip>
                {{ row.itemModel }}
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="itemName" />
            <el-table-column label="商品品牌" prop="itemBrand" />
            <el-table-column label="单位" prop="commodityUnit" />
            <el-table-column label="数量" prop="qty" />
            <el-table-column label="单价" prop="price" />
            <el-table-column label="金额">
              <template slot-scope="{row}">
                {{ calculateMemberAmount(row.price, row.qty) }}
              </template>
            </el-table-column>
            <el-table-column label="产地" prop="itemOrigin" />
            <el-table-column label="净重(KG)" prop="nw" />
            <el-table-column label="毛重(KG)" prop="gw" />
            <el-table-column label="物料号" prop="pn" />
            <el-table-column label="PO号" prop="poNo" />
            <el-table-column label="件数" prop="packages" />
            <el-table-column label="供应商发票号" prop="supplierInvoiceNo" />
          </el-table>
          <!--分页 及 商品信息汇总-->
          <el-row>
            <el-col :span="6">
              <!--分页-->
              <Pagination :total="totalMember" :page.sync="memberPage" :limit="memberPageSize" layout="total, prev, pager, next" @pagination="getMemberPageData" />
            </el-col>
            <el-col :span="12">
              <div class="order-member-total-message-container">
                <div class="order-member-total-message">
                  <span>总项数: {{ totalMember }}</span>
                  <span>总数量: {{ totalQty }}</span>
                  <span>总金额: {{ totalPrice }}</span>
                </div>
              </div>
            </el-col>
          </el-row>

          <!--新增修改明细窗口-->
          <AddAndEditItemDialog ref="itemDialog" />
          <!--导入明细窗口-->
          <TemplateImport ref="importMemberDialog" title="批量上传产品" :baba="this" template-file-id="1356171993041108993" />
        </div>

        <!---------------------------------------------境外结算--------------------------------------------------->
        <div class="abroad-settlement-container">
          <el-divider content-position="left">境外结算</el-divider>
          <!--境外结算方式 及 支付方式-->
          <el-row>
            <el-form-item label="境外结算方式:">
              <el-radio-group v-model="form.hsePayStyle">
                <el-radio-button :label="0">送货前付款</el-radio-button>
                <el-radio-button :label="1">送货收票</el-radio-button>
                <el-radio-button :label="2">送货后付款</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="form.hsePayStyle === 0 || form.hsePayStyle === 1" label="支付方式:">
              <el-radio-group v-model="form.payFeeStyle">
                <!--送货前付款-->
                <el-radio-button v-if="form.hsePayStyle === 0" :label="0">转账</el-radio-button>
                <el-radio-button v-if="form.hsePayStyle === 0" :label="1">信用证</el-radio-button>
                <!--送货收票-->
                <el-radio-button v-if="form.hsePayStyle === 1" :label="2">支票</el-radio-button>
                <el-radio-button v-if="form.hsePayStyle === 1" :label="3">期票</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-row>

          <!--送货前付款 送货收票-->
          <el-row v-show="form.hsePayStyle === 0 || form.hsePayStyle === 1">
            <el-form-item label="本次付款金额:">
              <el-input v-model="form.temFee" placeholder="付款比例" class="input-with-select">
                <el-select slot="prepend" v-model="payPercent" placeholder="付款比例" @change="changePayPercent">
                  <el-option v-for="item in payPercentList" :key="item" :label="item * 100 + '%'" :value="item" />
                </el-select>
              </el-input>
            </el-form-item>
            <!--送货前付款 信用证 信用证天数-->
            <el-form-item v-show="form.hsePayStyle === 0 && form.payFeeStyle === 1" label="信用证天数:">
              <el-input-number v-model="form.ticketDay" step-strictly />
            </el-form-item>
            <!--送货收票 期票 期票天数-->
            <el-form-item v-show="form.hsePayStyle === 1 && form.payFeeStyle === 3" label="期票天数:">
              <el-input-number v-model="form.termBillDay" step-strictly />
            </el-form-item>
          </el-row>

          <!--送货前付款 信用证附件-->
          <el-row v-show="form.hsePayStyle === 0 && form.payFeeStyle === 1">
            <el-form-item label="信用证附件:">
              <FileUpload ref="lcFile" :file-tag="1" :max-size="5 * 1024 * 1024" accept="doc,jpg,png" />
            </el-form-item>
          </el-row>

          <!--送货前付款 送货收票-->
          <el-row v-show="form.hsePayStyle === 0 || form.hsePayStyle === 1">
            <el-form-item label="收款方户名:">
              <el-select v-model="form.supplierBank" value-key="id" filterable clearable>
                <el-option v-for="item in supplierBankList" :key="item.id" :label="item.supplierAccountName" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item v-show="form.hsePayStyle === 0" label="收款人账号:">
              <el-input :value="form.supplierBank ? form.supplierBank.supplierBankAccountNo : ''" readonly disabled />
            </el-form-item>
          </el-row>

          <!--送货前付款 送货收票-->
          <el-row v-show="form.hsePayStyle === 0">
            <el-form-item label="开户银行:">
              <el-input :value="form.supplierBank ? form.supplierBank.supplierBankName : ''" readonly disabled />
            </el-form-item>
            <el-form-item label="Swift Code:">
              <el-input :value="form.supplierBank ? form.supplierBank.supplierBankSwiftCode : ''" readonly disabled />
            </el-form-item>
          </el-row>
        </div>

        <!---------------------------------------------香港物流--------------------------------------------------->
        <div class="hk-logistics-container">
          <el-divider content-position="left">
            香港物流
          </el-divider>
          <el-alert title="交货要求" type="info" show-icon>
            1、报订单号<br>
            2、随货附装箱单，发票各一式三份<br>
            3、快递交货提前提供快递单号<br>
            4、货物标签需体现型号、数量、品牌、产地且贴标签面对外摆放
          </el-alert>
          <!--到货类型-->
          <el-row>
            <el-form-item label="到货类型:">
              <el-radio-group v-model="form.checkType">
                <el-radio-button :label="1">供应商送货</el-radio-button>
                <el-radio-button :label="2">华富洋提货</el-radio-button>
                <el-radio-button :label="3">快递到货</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <!--华富洋提货-->
          <el-row v-show="form.checkType === 2">
            <el-form-item label="提货类型:">
              <el-radio-group v-model="form.deliveryTypeHk">
                <el-radio-button :label="0">单个提货点</el-radio-button>
                <el-radio-button :label="1">多个提货点</el-radio-button>
              </el-radio-group>
              <!--多点提货 提货提示-->
              <div v-show="form.deliveryTypeHk === 1" class="tip-message">多个提货点提货时请在订单保存后至 提货安排 中新增</div>
            </el-form-item>
            <!--单个提货点-->
            <el-form-item v-show="form.deliveryTypeHk === 0" label="提货时间:">
              <el-date-picker v-model="form.checkDateTime" type="datetime" />
            </el-form-item>
          </el-row>

          <!--华富洋提货 单个提货点-->
          <el-row v-show="form.checkType === 2 && form.deliveryTypeHk === 0">
            <el-form-item label="提货件数:" class="pick-numbers-form-item">
              <el-input v-model="form.totalPallet">
                <template slot="append">板</template>
              </el-input>
              <el-input v-model="form.totalPackage">
                <template slot="append">箱</template>
              </el-input>
            </el-form-item>
            <el-form-item label="提货单号:">
              <el-input v-model.trim="form.pickUpNo" clearable />
            </el-form-item>
          </el-row>

          <!--华富洋提货 单个提货点 提货地址-->
          <el-row v-show="form.checkType === 2 && form.deliveryTypeHk === 0">
            <el-form-item label="提货地址:" class="address-form-item">
              <PickAddressPicker ref="pickAddress" />
            </el-form-item>
          </el-row>

          <!--华富洋提货 单个提货点 提货附件-->
          <el-row v-show="form.checkType === 2 && form.deliveryTypeHk === 0">
            <el-form-item label="提货附件:">
              <FileUpload ref="pickFile" :file-tag="2" :max-size="5 * 1024 * 1024" accept="doc,jpg,png" />
            </el-form-item>
          </el-row>

          <!--快递到货-->
          <el-row v-show="form.checkType === 3">
            <el-form-item label="运营商:">
              <el-select v-model.trim="form.checkExpressName" filterable clearable allow-create>
                <el-option v-for="item in checkExpressList" :key="item" :label="item" :value="item" />
              </el-select>
              <div class="tip-message">可手动录入其他运营商</div>
            </el-form-item>
            <el-form-item label="快递单号:">
              <el-input v-model.trim="form.checkExpressNo" />
              <div class="tip-message">多个快递单号时请用 / 分隔</div>
            </el-form-item>
          </el-row>
        </div>

        <!---------------------------------------------国内物流--------------------------------------------------->
        <el-divider content-position="left">
          国内物流
        </el-divider>
        <el-alert type="info" show-icon>
          默认配送时间：工作日周一至周五9:00 - 18:00<br>
          如贵司在非工作时段或节假日可收货，请在备注栏说明
        </el-alert>
        <!---------------------------------------------备注及其他--------------------------------------------------->
        <div class="other-info-container">
          <el-divider content-position="left">备注及其他</el-divider>
          <!--特殊关系和影响报关价格-->
          <el-row>
            <el-form-item prop="special">
              <el-tooltip slot="label" effect="light" content="买卖双方是否存在特殊关系">
                <span>特殊关系:</span>
              </el-tooltip>
              <el-radio-group v-model="form.special">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="form.special" prop="effectDeclarationPrice">
              <el-tooltip slot="label" effect="light" content="此特殊关系是否影响商品报关价格">
                <span>影响报关价格:</span>
              </el-tooltip>
              <el-radio-group v-model="form.effectDeclarationPrice">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <!--备注-->
          <el-row>
            <el-form-item label="备注:" prop="remark">
              <el-input v-model.trim="form.remark" type="textarea" :autosize="{ minRows: 5}" maxlength="250" show-word-limit />
            </el-form-item>
          </el-row>
          <!--发票及装箱单-->
          <el-row>
            <el-form-item label="发票:">
              <FileUpload ref="invoiceFile" :file-tag="1" :max-size="5 * 1024 * 1024" accept="doc,jpg,png" other-tip="请上传供应商出具的INVOICE" />
            </el-form-item>
            <el-form-item label="装箱单:">
              <FileUpload ref="packingListFile" :file-tag="1" :max-size="5 * 1024 * 1024" accept="doc,jpg,png" other-tip="请上传供应商出具的PACKING LIST" />
            </el-form-item>
          </el-row>
        </div>
      </el-form>
    </div>
    <!--提交 及 暂存按钮-->
    <div class="order-form-button-container">
      <el-button type="primary" class="submit-button" @click="submitForm">
        暂存
      </el-button>
      <el-button type="primary" class="submit-button" @click="submitForm">
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import { mul } from '@/utils/calculate'
import FileUpload from '@/components/FileUpload'
import PickAddressPicker from '@/components/AddressPicker'
import Pagination from '@/components/Pagination'
import AddAndEditItemDialog from '@/components/AddAndEditItemDialog'
import TemplateImport from '@/components/TemplateImport'
export default {
  name: 'CreateBookingOrder',
  components: { FileUpload, PickAddressPicker, Pagination, AddAndEditItemDialog, TemplateImport },
  data() {
    return {
      form: {
        settleId: '', supplierId: '', currencyId: '', supplierContact: '', appointContractNo: '', contractNo: '',
        members: [],
        hsePayStyle: '', payFeeStyle: '', temFee: '', ticketDay: undefined, termBillDay: undefined, supplierBank: '',

        special: '', effectDeclarationPrice: '', remark: ''
      },
      // 境内结算方式,即方案下拉
      settlementList: [
        { id: 1, businessType: '单抬头报关', settlementMode: '现结', accountPeriod: '' },
        { id: 2, businessType: '单抬头报关', settlementMode: '垫全款', accountPeriod: '次月31日结' },
        { id: 3, businessType: '单抬头报关', settlementMode: '垫税款', accountPeriod: '30天' },
        { id: 4, businessType: '双抬头报关', settlementMode: '垫税款', accountPeriod: '30天' }
      ], businessType: '',
      // 供应商下拉
      supplierList: [
        { id: 1, supplierName: '创新在线电子有限公司', supplierNameEn: 'create new online elc ltd' },
        { id: 2, supplierName: 'where r u now', supplierNameEn: 'where r u now' },
        { id: 3, supplierName: 'Izhevsky Mekhanichesky Zavod JSC', supplierNameEn: 'Izhevsky Mekhanichesky Zavod JSC' }
      ],
      supplierContactList: [{ id: 1, name: '测试供应商联系人A', tel: '188', phone: '18888888888' }, { id: 2, name: '测试供应商联系人B', tel: '199', phone: '19999999999' }], currentSupplierContact: undefined,
      // 支持的币别 和 展示的币别
      currencyList: [
        { id: 1, name: '美元' }, { id: 2, name: '港币' }, { id: 3, name: '人民币' },
        { id: 4, name: '欧元' }, { id: 5, name: '日元' }, { id: 6, name: '英镑' }, { id: 7, name: '瑞士法郎' }
      ], currencyArray: [], showAllSupportCurrency: true,
      // 供应商银行下拉
      supplierBankList: [
        { id: 1, supplierAccountName: '供应商银行A', supplierBankAccountNo: '1111111', supplierBankName: '汇丰', supplierBankSwiftCode: 'AAAAAA' },
        { id: 2, supplierAccountName: '供应商银行B', supplierBankAccountNo: '2222222', supplierBankName: '渣打', supplierBankSwiftCode: 'BBBBBB' }
      ],
      // 订单明细合计
      totalMember: 0, memberPage: 1, memberPageSize: 5, totalQty: 0, totalPrice: 0, memberSelection: [],
      // 香港物流运营商
      checkExpressList: ['FEDEX', 'UPS', 'DHL', 'EMS'],
      // 付款比例下拉 付款总额
      payPercent: '', payPercentList: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1],
      rules: {
        settleId: [
          { required: true, message: '境内结算方式必填', trigger: 'change' }
        ],
        currencyId: [
          { required: true, message: '币别必选', trigger: 'change' }
        ],
        special: [
          { required: true, message: '买卖双方是否存在特殊关系必选', trigger: 'change' }
        ],
        effectDeclarationPrice: [
          { required: true, message: '此关系是否影响商品报关价格必选', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.showMoreCurrency()
    this.getMemberPageData()
  },
  methods: {
    // 变更抬头 单抬头1 双抬头2
    changeSettlement(id) {
      const selectedSettlement = this.settlementList.find(item => item.id === id)
      if (selectedSettlement) {
        this.businessType = selectedSettlement.businessType.indexOf('单抬头') !== -1 ? 1 : 2
      } else {
        this.businessType = ''
      }
    },
    // 获取前端分页数据
    getMemberPageData() {
      const members = [
        { itemModel: '1851-13-437P 40(2.5-11D-5)20D-AB10X10-CDR2B-CZ3(61220019)', commodityUnit: '个', price: 0.0015, qty: 1234, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: true, gs: '', zjgs: '' },
        { itemModel: 'LS L29K-G1H2-1-Z', itemName: 'IC', commodityUnit: '个', price: 0.05, qty: 10000, itemBrand: 'OSRAM', itemOrigin: '马来西亚', packages: '9999', pn: 'this pn', nw: 1.0, gw: 1.2, poNo: 'this pono', involveRoyalty: false, gs: '', zjgs: '' },
        { itemModel: 'XXPP-002', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: true, gs: '10%', zjgs: '5%' },
        { itemModel: 'XXPP-001sadasdasdasdasda', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
        { itemModel: 'XXPP-003', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
        { itemModel: 'XXPP-004', commodityUnit: '个', price: 0.0015, qty: 26262, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' }
      ]
      if (members && members.length > 0) {
        this.totalMember = members.length
        if (members.length <= this.memberPageSize) {
          this.form.members = members
        } else {
          let end = this.memberPage * this.memberPageSize
          if (end > this.totalMember) {
            end = this.totalMember
          }
          this.form.members = members.slice((this.memberPage - 1) * this.memberPageSize, end)
        }
      } else {
        this.memberTotal = 0
        this.form.members = []
      }
      this.getSummaries()
    },
    // 订单明细选择变化
    handleOrderMemberSelectionChange(val) {
      this.memberSelection = val
    },
    // 新增商品弹出框
    showCreateItemDialog() {
      this.$refs.itemDialog.createShow()
    },
    // 批量上传产品弹出框
    showImportItemDialog() {
      this.$refs.importMemberDialog.show()
    },
    // 更新商品弹出框
    showEditItemDialog() {
      this.$refs.itemDialog.updateShow()
    },
    // 删除商品明细
    deleteMembers() {
      this.$message.success('删除' + this.memberSelection.length + '条')
    },
    // 合计 在新增,删除明细时后台返回
    getSummaries() {
      this.totalMember = 6
      this.totalQty = 52496
      this.totalPrice = 563.744
      this.form.temFee = this.totalPrice
    },
    // 计算商品单条总价
    calculateMemberAmount(a, b) {
      return mul(a, b)
    },
    // 变更付款比例
    changePayPercent(percent) {
      this.form.temFee = mul(this.totalPrice, percent)
    },
    // 展示更多币制
    showMoreCurrency() {
      this.showAllSupportCurrency = !this.showAllSupportCurrency
      // 是否展示所有币制, 默认只展示前2个
      if (this.showAllSupportCurrency) {
        this.currencyArray = this.currencyList
      } else {
        this.currencyArray = this.currencyList.slice(0, 2)
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form)
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
.order-container{
  padding: 0 0 15px 0;
  .order-form-container{
    margin: 0 15px 65px 15px;
    .el-row{
      .input-with-select {
        .el-select{width: 110px;}
      }
      .show-more-currency{ margin-left: 12px;}
    }
    .el-form-item{
      width: 520px;
      .el-form-item__content{
        width: 400px;
      }
    }
    .currency-form-item{
      // 兼容1024*768 最大700左侧导航占用 300
      width: 700px;
      .el-form-item__content{
        width: 580px;
      }
    }
    .order-member-container{
      .order-member-button-container{
        margin-bottom: 8px;
      }
      .order-member-table-container{
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      }
      .order-member-total-message-container{
        margin-top: 5px;
        padding: 10px 0 10px 0;
        color: #f0862b;
        text-align: center;
        .order-member-total-message{
          display: inline-block;
          font-size: 18px;
          height: 28px;
          line-height: 28px;
          vertical-align: top;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          font-weight: bold;
          span{
            margin-left: 15px;
          }
        }
      }
    }
    .el-divider__text {
      position: absolute;
      padding: 0 20px;
      font-weight: 600;
      color: #f0862b;
      font-size: 16px;
    }
    .el-alert {
      margin-bottom: 12px;
      color: #f0862b;
      .el-alert__description {
        color: #f0862b;
      }
    }
    .tip-icon{
      color: #f0862b;
      font-size: 24px;
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
    .pick-numbers-form-item{
      .el-input-group{ width: 50%;}
    }
    .address-form-item{
      width: 100%;
      .el-form-item__content{
        width: calc(100% - 120px);
      }
    }
  }
  .left-select-option{
    float: left;
  }
  .right-select-option{
    float: right; color: #8492a6;
  }
  // tooltip 弹出文字样式
  .tooltip-content{
    font-size: 14px;
    line-height: 1.8;
  }
  .order-form-button-container {
    background: none repeat scroll 0 0 #FFF;
    border-top: 1px solid #e7eaec;
    height: 50px;
    color: #7a8b9a;
    position: fixed;
    bottom: 33px;
    z-index: 99;
    width: 100%;
    text-align: center;
    .el-button{
      width: 240px;
      height: 40px;
      margin: 5px 15px 0 0;
    }
  }
}
</style>

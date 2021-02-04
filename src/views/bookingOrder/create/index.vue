<template>
  <div class="order-form-container">
    <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="120px" label-position="right">
      <!---------------------------------------------订单信息--------------------------------------------------->
      <el-divider content-position="left">订单信息</el-divider>
      <!--境内结算方式-->
      <div class="row">
        <el-form-item label="境内结算方式:" prop="settleId">
          <el-select v-model.trim="form.settleId" filterable clearable @change="changeSettlement">
            <el-option v-for="item in settlementList" :key="item.id" :label="item.businessType + '-' +(item.accountPeriod ? item.settlementMode + '-' + item.accountPeriod : item.settlementMode)" :value="item.id">
              <span class="left-select-option">{{ item.businessType + ' ' + item.settlementMode }}</span>
              <span v-show="item.accountPeriod" class="right-select-option">{{ item.accountPeriod }}</span>
            </el-option>
          </el-select>
          <div v-show="businessType" class="tip-message">{{ businessType === 2 ? '海关' : '华富洋' }}开13%增值税票</div>
        </el-form-item>
      </div>
      <!--币别-->
      <div class="row">
        <el-form-item label="币别:" class="currency-form-item">
          <el-radio-group v-model="form.currencyId">
            <el-radio-button v-for="item in currencyArray" :key="item.id" :label="item.id">{{ item.name }}</el-radio-button>
          </el-radio-group>
          <el-link type="primary" :icon="showAllSupportCurrency ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'" class="show-more-currency" @click="showMoreCurrency" />
        </el-form-item>
      </div>
      <!--供应商名称 及 联系人-->
      <div class="row">
        <el-form-item label="供应商名称:">
          <el-select v-model.trim="form.supplierId" filterable clearable>
            <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商联系人:">
          <el-select v-model.trim="form.supplierContact" value-key="id" filterable clearable>
            <el-option v-for="item in supplierContactList" :key="item.id" :label="item.name + ' ( ' + (item.tel ? item.tel + ' / ' + item.phone : item.phone) + ' )'" :value="item" />
          </el-select>
        </el-form-item>
      </div>
      <!--双抬头 指定报关合同号-->
      <div class="row">
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
      </div>

      <!---------------------------------------------商品信息--------------------------------------------------->
      <el-divider content-position="left">商品信息</el-divider>
      <el-table ref="table" :data="form.members" highlight-current-row show-summary :summary-method="getSummaries" max-height="400" class="order-member-table-container">
        <el-table-column type="index" width="50" />
        <el-table-column type="selection" width="50" />
        <el-table-column label="商品型号" prop="itemModel" width="200">
          <template slot-scope="{row}">
            <el-tooltip v-show="row.gs" :content="'关税率' + row.gs + ( row.zjgs ? ',包含加征关税' + row.zjgs : '')">
              <i class="el-icon-warning tip-icon" />
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
        <el-table-column label="特许权" prop="involveRoyalty">
          <template slot-scope="{row}">
            {{ row.involveRoyalty ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="供应商发票号" prop="supplierInvoiceNo" />
        <el-table-column label="操作" width="70">
          <template slot-scope="{row}">
            <el-button type="danger" icon="el-icon-delete" @click="deleteMember(row)" />
          </template>
        </el-table-column>
      </el-table>

      <!---------------------------------------------境外结算--------------------------------------------------->
      <el-divider content-position="left">境外结算</el-divider>
      <!--境外结算方式-->
      <div class="row">
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
      </div>

      <!--送货前付款 送货收票-->
      <div v-show="form.hsePayStyle === 0 || form.hsePayStyle === 1" class="row">
        <el-form-item label="本次付款金额:">
          <el-input v-model="form.temFee" type="number" placeholder="付款比例" class="input-with-select">
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
      </div>
      <!--送货前付款 信用证附件-->
      <div v-show="form.hsePayStyle === 0 && form.payFeeStyle === 1" class="row">
        <el-form-item label="信用证附件:">
          <FileUpload ref="lcFile" :file-tag="1" :max-size="5 * 1024 * 1024" accept="doc,jpg,png" />
        </el-form-item>
      </div>
      <!--送货前付款 送货收票-->
      <div v-show="form.hsePayStyle === 0 || form.hsePayStyle === 1" class="row">
        <el-form-item label="收款方户名:">
          <el-select v-model="form.supplierBank" value-key="id" filterable clearable>
            <el-option v-for="item in supplierBankList" :key="item.id" :label="item.supplierAccountName" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.hsePayStyle === 0" label="收款人账号:">
          <el-input :value="form.supplierBank ? form.supplierBank.supplierBankAccountNo : ''" readonly disabled />
        </el-form-item>
      </div>
      <div v-show="form.hsePayStyle === 0" class="row">
        <el-form-item label="开户银行:">
          <el-input :value="form.supplierBank ? form.supplierBank.supplierBankName : ''" readonly disabled />
        </el-form-item>
        <el-form-item label="Swift Code:">
          <el-input :value="form.supplierBank ? form.supplierBank.supplierBankSwiftCode : ''" readonly disabled />
        </el-form-item>
      </div>

      <!---------------------------------------------香港物流--------------------------------------------------->
      <el-divider content-position="left">香港物流</el-divider>
      <!--到货类型-->
      <div class="row">
        <el-form-item label="到货类型:">
          <el-radio-group v-model="form.checkType">
            <el-radio-button :label="1">供应商送货</el-radio-button>
            <el-radio-button :label="2">华富洋提货</el-radio-button>
            <el-radio-button :label="3">快递到货</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <!--华富洋提货-->
      <div v-show="form.checkType === 2" class="row">
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
      </div>

      <!--华富洋提货 单个提货点-->
      <div v-show="form.checkType === 2 && form.deliveryTypeHk === 0" class="row">
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
      </div>

      <!--华富洋提货 单个提货点 提货地址-->
      <div v-show="form.checkType === 2 && form.deliveryTypeHk === 0" class="row">
        <el-form-item label="提货地址:" class="address-form-item">
          <PickAddressPicker ref="pickAddress" />
        </el-form-item>
      </div>

      <!--华富洋提货 单个提货点 提货附件-->
      <div v-show="form.checkType === 2 && form.deliveryTypeHk === 0" class="row">
        <el-form-item label="提货附件:">
          <FileUpload ref="pickFile" :file-tag="2" :max-size="5 * 1024 * 1024" accept="doc,jpg,png" />
        </el-form-item>
      </div>

      <!--快递到货-->
      <div v-show="form.checkType === 3" class="row">
        <el-form-item label="运营商:">
          <el-select v-model.trim="form.checkExpressName" filterable clearable allow-create>
            <el-option v-for="item in checkExpressList" :key="item" :label="item" :value="item" />
          </el-select>
          <div class="tip-message">多个快递单号时请用 / 分割</div>
        </el-form-item>
        <el-form-item label="快递单号:">
          <el-input v-model.trim="form.checkExpressNo" />
          <div class="tip-message">可手动录入其他运营商</div>
        </el-form-item>
      </div>

      <!---------------------------------------------国内物流--------------------------------------------------->
      <el-divider content-position="left">国内物流</el-divider>
      <!---------------------------------------------备注及其他--------------------------------------------------->
      <el-divider content-position="left">备注及其他</el-divider>

      <Sticky :z-index="999" sticky-top="100%">
        <el-button type="primary" @click="submitForm">
          提交
        </el-button>
      </Sticky>
    </el-form>
  </div>
</template>

<script>
import { add, mul } from '@/utils/calculate'
import FileUpload from '@/components/FileUpload'
import PickAddressPicker from '@/components/AddressPicker'
import Sticky from '@/components/Sticky'
export default {
  name: 'CreateBookingOrder',
  components: { FileUpload, PickAddressPicker, Sticky },
  data() {
    return {
      form: {
        settleId: '', supplierId: '', currencyId: '', supplierContact: '', appointContractNo: '', contractNo: '',
        members: [],
        hsePayStyle: '', payFeeStyle: '', temFee: '', ticketDay: undefined, termBillDay: undefined, supplierBank: ''
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
      // 香港物流运营商
      checkExpressList: ['FEDEX', 'UPS', 'DHL', 'EMS'],
      // 付款比例下拉 付款总额
      payPercent: '', payPercentList: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1], totalPrice: '',
      rules: {
        settleId: [
          { required: true, message: '境内结算方式必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.form.members = [
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 1234, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '', zjgs: '' },
      { itemModel: 'LS L29K-G1H2-1-Z', itemName: 'IC', commodityUnit: '个', price: 0.05, qty: 10000, itemBrand: 'OSRAM', itemOrigin: '马来西亚', packages: '9999', pn: 'this pn', nw: 1.0, gw: 1.2, poNo: 'this pono', involveRoyalty: false, gs: '10%', zjgs: '' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001sadasdasdasdasda', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 26262, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-00adadasdasdsfg g1', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 55656, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPPsfdsd fsdf sf-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.1015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-sdfs fs001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-afwe十大歌手个0df 01', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0115, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 55, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-鬼地方个地方官大范甘迪', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.2015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 22, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-大范甘迪贵妇狗', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0013, qty: 15615, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.3015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' },
      { itemModel: 'XXPP-001', commodityUnit: '个', price: 0.0015, qty: 5000, itemBrand: '3L', itemOrigin: '美国', involveRoyalty: false, gs: '10%', zjgs: '5%' }
    ]
    this.showMoreCurrency()
  },
  methods: {
    // 变更抬头 单抬头1 双抬头2
    changeSettlement(id) {
      const selectedSettlement = this.settlementList.find(item => item.id === id)
      console.log(selectedSettlement)
      if (selectedSettlement) {
        this.businessType = selectedSettlement.businessType.indexOf('单抬头') !== -1 ? 1 : 2
      } else {
        this.businessType = ''
      }
    },
    // 删除商品明细
    deleteMember(row) {
      this.$message.success('删除' + row.itemModel)
      console.log(this.$refs.settlement)
      console.log(this.form)
    },
    // 合计
    getSummaries(param) {
      const { data } = param
      const sums = []
      const count = data ? data.length : 0
      // 总数量
      let qtyTotal = 0
      // 总价
      let totalPrice = 0
      // 总净重
      let totalNw = 0
      // 总毛重
      let totalgw = 0
      // 总件数
      let totalPackages = 0
      data.map(row => {
        qtyTotal = add(qtyTotal, row.qty)
        totalPrice = add(totalPrice, mul(row.price, row.qty))
        totalNw = add(totalNw, row.nw)
        totalgw = add(totalgw, row.gw)
        totalPackages = add(totalPackages, row.packages)
      })
      sums[0] = '合计'
      sums[2] = '共' + count + '项'
      sums[6] = qtyTotal
      sums[8] = totalPrice
      sums[10] = totalNw
      sums[11] = totalgw
      sums[14] = totalPackages
      this.totalPrice = totalPrice
      this.form.temFee = totalPrice
      return sums
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
<style lang="scss">
.order-form-container{
  margin: 8px;
  .el-form-item{
    width: 520px;
    margin-bottom: 8px !important;
    margin-top: 8px !important;
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
  .order-member-table-container{
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  .row{
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    .input-with-select {
      .el-select{width: 110px;}
    }
    .show-more-currency{ margin-left: 12px; color: #f0862b;}
  }
  .el-divider__text {
    position: absolute;
    padding: 0 20px;
    font-weight: 500;
    color: #f0862b;
    font-size: 16px;
  }
  .tip-icon{
    color: #f0862b;
    font-size: 16px;
  }
  .tip-message{
    margin-top: 2px;
    color: #f0862b;
  }
  .pick-numbers-form-item{
    .el-input-group{ width: 50%;}
  }
  .address-form-item{
    width: 100%;
    .el-form-item__content{
      width: calc(100% - 200px);
    }
  }
}
.left-select-option{
  float: left;
}
.right-select-option{
  float: right; color: #8492a6;
}
</style>

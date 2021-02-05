<template>
  <el-table ref="addressTable" v-loading="addressLoading" :data="addressList" :show-header="false" max-height="300px" class="address-table-container" highlight-current-row @row-click="handleClickTableRow" @select="handleSelect">
    <el-table-column type="selection" width="50" />
    <el-table-column label="地址" prop="address" />
    <el-table-column label="姓名" prop="name" />
    <el-table-column label="电话" prop="tel" />
    <el-table-column label="手机" prop="phone" />
  </el-table>
</template>

<script>

export default {
  name: 'AddressPicker',
  props: {
  },
  data() {
    return {
      addressLoading: false,
      addressList: [
        { id: 1, address: 'FLAT/RM 4A,BLK B 7F,PO YIP BUILDING,62-70 TEXACO ROAD,TSUENWAN,N.T.,HONGKONG', name: 'PEDDER (GROUP) LOGISTICS LTD 八达仓 NICK /强  ', tel: '18888881111', phone: '00852-24533737、 26686698、26681782' },
        { id: 2, address: 'A香港 香港 湾仔区 铜锣湾 xxxxx', name: '陈浩南', tel: '(852)2763-0732分機# 7263', phone: '18888882222' },
        { id: 3, address: '鸿涛国际贸易有限公司 HUNG TAO INTERNATIONAL TRADING LTD 地址：香港新界葵涌華星街8號華達工業中心A座19樓2-3號室 UNIT 2-3RM 19/F BLOCK A WAH TAT INDUSTRIAL CENTRE NO.8  WAH SING STREET KWAI CHUNG N.T HONGKONG', name: '陈浩南', tel: '068+15656565', phone: '18888882222' },
        { id: 4, address: 'B香港 香港 湾仔区 铜锣湾 xxxxx', name: '陈浩南', tel: '(852)2763-0732分機# 7263', phone: '18888882222' },
        { id: 5, address: 'C香港 香港 湾仔区 铜锣湾 xxxxx', name: '陈浩南', tel: '(852)2763-0732分機# 7263', phone: '18888882222' },
        { id: 6, address: 'D香港 香港 湾仔区 铜锣湾 xxxxx', name: '陈浩南', tel: '(852)2763-0732分機# 7263', phone: '18888882222' }
      ]
    }
  },
  methods: {
    handleClickTableRow(row, event, column) {
      const rows = this.$refs.addressTable.selection
      this.$refs.addressTable.clearSelection()
      // 点击自身 去掉勾选
      if (!rows || rows.length === 0 || rows[0].id !== row.id) {
        this.$refs.addressTable.toggleRowSelection(row)
      }
    },
    handleSelect(selection, row) {
      // 点击自身 去掉勾选
      if (selection && selection.length === 0) {
        this.$refs.addressTable.clearSelection()
      } else {
        this.$refs.addressTable.clearSelection()
        this.$refs.addressTable.toggleRowSelection(selection[selection.length - 1])
      }
    }
  }
}
</script>
<style lang="scss">
.address-table-container{
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>

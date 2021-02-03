// import request from '@/utils/request'

export function list(data) {
  const start = (data.page - 1) * data.size
  let rows = [
    { id: 1, bookingNo: 'AN21000001', bookingDate: '2021-02-01 15:44', status: '暂存', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 2, bookingNo: 'AN21000002', bookingDate: '2021-02-01 15:44', status: '受理中', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-双抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 3, bookingNo: 'AN21000003', bookingDate: '2021-02-01 15:44', status: '受理中', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '日元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 4, bookingNo: 'AN21000004', bookingDate: '2021-02-01 15:44', status: '受理中', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 5, bookingNo: 'AN21000005', bookingDate: '2021-02-01 15:44', status: '受理中', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货' },
    { id: 6, bookingNo: 'AN21000006', bookingDate: '2021-02-01 15:44', status: '已受理', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 7, bookingNo: 'AN21000007', bookingDate: '2021-02-01 15:44', status: '受理中', supplierName: '创新在线电子有限公司1664dasdadasdasda', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 8, bookingNo: 'AN21000008', bookingDate: '2021-02-01 15:44', status: '已受理', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 9, bookingNo: 'AN21000009', bookingDate: '2021-02-01 15:44', status: '暂存', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 10, bookingNo: 'AN21000010', bookingDate: '2021-02-01 15:44', status: '暂存', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 11, bookingNo: 'AN21000011', bookingDate: '2021-02-01 15:44', status: '受理中', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 12, bookingNo: 'AN21000012', bookingDate: '2021-02-01 15:44', status: '已受理', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 13, bookingNo: 'AN21000013', bookingDate: '2021-02-01 15:44', status: '暂存', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 14, bookingNo: 'AN21000014', bookingDate: '2021-02-01 15:44', status: '受理中', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 15, bookingNo: 'AN21000015', bookingDate: '2021-02-01 15:44', status: '已受理', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 16, bookingNo: 'AN21000016', bookingDate: '2021-02-01 15:44', status: '受理中', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 17, bookingNo: 'AN21000017', bookingDate: '2021-02-01 15:44', status: '受理中', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 18, bookingNo: 'AN21000018', bookingDate: '2021-02-01 15:44', status: '已受理', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 19, bookingNo: 'AN21000019', bookingDate: '2021-02-01 15:44', status: '受理中', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 },
    { id: 20, bookingNo: 'AN210000020', bookingDate: '2021-02-01 15:44', status: '已受理', supplierName: '创新在线电子有限公司', totalAmount: '123.45', currency: '美元', businessType: '进口-单抬头', logisticsStatus: '未收货', fileCount: 0 }
  ]
  rows = rows.splice(start, data.size)
  return Promise.resolve({
    total: 20,
    rows: rows
  })
}

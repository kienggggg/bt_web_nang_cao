import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName) => {
  // 1. Tạo một WorkBook mới (file Excel ảo)
  const wb = XLSX.utils.book_new();

  // 2. Tạo một WorkSheet (Sheet tính) từ dữ liệu JSON
  const ws = XLSX.utils.json_to_sheet(data);

  // 3. Thêm Sheet vào WorkBook
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // 4. Xuất file
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
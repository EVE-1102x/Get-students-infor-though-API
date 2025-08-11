const SHEETS = {
  LICH: "Lịch",
  THEO_DOI_CT: "Theo dõi CT",
  CHAM_BAI: "Theo dõi chấm bài",
};

const loadWorkbookTemplate = async () => {
  const ExcelJS = await import("exceljs");
  const resp = await fetch("/template_cham_cong_export.xlsx");
  const buf = await resp.arrayBuffer();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);
  return wb;
};

// === Sheet: Lịch thi ===
const buildSheetLich = (wb, { tenKy, khoi, namHoc }, data = []) => {
  const ws = wb.getWorksheet(SHEETS.LICH);
  const assetsSheet = wb.getWorksheet("Assets");

  if (!ws || !assetsSheet) {
    console.warn(`❌ Required sheets not found.`);
    return;
  }

  // ==== Cập nhật tiêu đề
  const titleCell = ws.getCell("A3");
  titleCell.value = `LỊCH KIỂM TRA ${tenKy} - KHỐI ${khoi} - NĂM HỌC ${namHoc}`;
  titleCell.alignment = { horizontal: "center" };

  const START_ROW = 6;
  let currentRow = START_ROW;

  // ==== Ghi dữ liệu lịch vào sheet
  data.forEach((item, index) => {
    const row = ws.getRow(currentRow++);

    // Gán giá trị
    row.getCell(1).value = index + 1;
    row.getCell(2).value = item.ngayThang;
    row.getCell(3).value = item.gio;
    row.getCell(4).value = item.thoiGian;
    row.getCell(5).value = item.mon;
    row.getCell(6).value = item.soLuong;
    row.getCell(7).value = item.ghiChu || "";
    row.eachCell({ includeEmpty: false }, (cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    row.commit();
  });

  // ==== Copy footer từ sheet "Assets"
  const footerStartRow = 1;
  const footerEndRow = 6;
  const targetRowStart = currentRow + 1;

  // ===== 1. Copy nội dung, style, chiều cao dòng =====
  for (let r = footerStartRow; r <= footerEndRow; r++) {
    const sourceRow = assetsSheet.getRow(r);
    const targetRow = ws.getRow(targetRowStart + (r - footerStartRow));

    sourceRow.eachCell({ includeEmpty: true }, (cell, col) => {
      const targetCell = targetRow.getCell(col);
      targetCell.value = cell.value;
      targetCell.style = { ...cell.style };
    });

    targetRow.height = sourceRow.height;
  }

  // ===== 2. Sao chép merged cells từ assets sang sheet chính =====
  const mergesMap = assetsSheet._merges;
  const mergesArray = assetsSheet.mergedCells;
  let mergeRanges = [];

  if (mergesMap && typeof mergesMap === "object") {
    const mergeKeys = Object.keys(mergesMap); // Ví dụ: ["A2:C2", "E4:E5", ...]

    mergeRanges = mergeKeys
      .map((rangeAddress) => {
        const mergeInfo = mergesMap[rangeAddress];

        if (!mergeInfo || !mergeInfo.model) return null;

        const { top, left, bottom, right } = mergeInfo.model;
        return { top, left, bottom, right };
      })
      .filter(Boolean);
  } else if (Array.isArray(mergesArray)) {
    mergeRanges = mergesArray.map((m) => ({
      top: m.start.row,
      bottom: m.end.row,
      left: m.start.column,
      right: m.end.column,
    }));
  } else {
    console.warn("Merged cells structure not available in assets sheet.");
  }

  // Áp dụng lại các merge nếu có giao với vùng footer
  mergeRanges.forEach(({ top, bottom, left, right }, idx) => {
    const overlapsFooter = !(bottom < footerStartRow || top > footerEndRow);

    if (overlapsFooter) {
      const offset = targetRowStart - footerStartRow;
      const newTop = top + offset;
      const newBottom = bottom + offset;
      ws.mergeCells(newTop, left, newBottom, right);
    }
  });
};

// === Sheet: Theo dõi coi thi ===
const buildSheetTheoDoiCT = (wb, { tenKy, khoi, namHoc }, data = []) => {
  const ws = wb.getWorksheet(SHEETS.THEO_DOI_CT);
  const assetsSheet = wb.getWorksheet("Assets");

  if (!ws || !assetsSheet) {
    console.warn(
      `Required sheets '${SHEETS.THEO_DOI_CT}' and '${assetsSheet}' not found.`
    );
    return;
  }

  // ==== Cập nhật tiêu đề
  ws.getCell(
    "A2"
  ).value = `BẢNG THEO DÕI GIÁO VIÊN TRÔNG KIỂM TRA VÀ TRỰC ĐỀ KIỂM TRA ${tenKy}-KHỐI ${khoi}-NĂM HỌC ${namHoc}`;
  ws.getCell("A2").alignment = { horizontal: "center" };

  const START_ROW = 6;
  const HEADER_ROW_INDEX = 4;
  const CA_START_COL = 4; // ví dụ ô D là cột 4

  // === 1. Tìm số lượng ca nhiều nhất trong toàn bộ data
  const maxCaCount = Math.max(
    ...data.map(
      (item) =>
        ["ca_1", "ca_2", "ca_3", "ca_4"].filter(
          (key) => item[key] !== undefined
        ).length
    )
  );

  // === 2. Cần chèn thêm (maxCaCount - 1) cột sau cột CA gốc
  const columnsToInsert = maxCaCount > 1 ? maxCaCount - 1 : 0;

  if (columnsToInsert > 0) {
    // Chèn cột mới sau cột CA gốc (tức sau cột 4)
    ws.spliceColumns(CA_START_COL + 1, 0, ...Array(columnsToInsert).fill([]));
  }

  // === 3. Ghi tên các cột ca (CA 1 → CA n) bắt đầu từ cột D
  const headerRow = ws.getRow(HEADER_ROW_INDEX);
  for (let i = 0; i < maxCaCount; i++) {
    const cell = headerRow.getCell(CA_START_COL + i);
    cell.value = `CA ${i + 1}`;
    cell.alignment = { vertical: "middle", horizontal: "center" };
  }
  headerRow.commit();

  // === 4. Ghi dữ liệu
  let currentRow = START_ROW;

  data.forEach((item, index) => {
    const row = ws.getRow(currentRow++);

    // Cột A, B, C: STT, họ tên, môn
    row.getCell(1).value = index + 1;
    row.getCell(2).value = item.hoTen || "";
    row.getCell(3).value = item.monGiangDay || "";

    // Ghi dữ liệu ca từ cột D
    for (let i = 0; i < maxCaCount; i++) {
      const caValue = item[`ca_${i + 1}`] || "";
      row.getCell(CA_START_COL + i).value = caValue;
    }

    // Ghi các trường còn lại sau cột ca
    let nextCol = CA_START_COL + maxCaCount;
    row.getCell(nextCol++).value = item.tong_60 || "";
    row.getCell(nextCol++).value = item.tong_90 || "";
    row.getCell(nextCol++).value = item.tong_120 || "";
    row.getCell(nextCol++).value = item.ghiChu || "";

    // Căn giữa
    row.eachCell({ includeEmpty: false }, (cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    row.commit();
  });
};

// === Sheet: Theo dõi chấm bài ===
const buildSheetChamBai = (wb, { tenKy, khoi, namHoc }, data = []) => {
  const ws = wb.getWorksheet(SHEETS.CHAM_BAI);
  const assetsSheet = wb.getWorksheet("Assets");

  if (!ws || !assetsSheet) {
    console.warn(
      `Required sheets '${SHEETS.CHAM_BAI}' and '${assetsSheet}' not found.`
    );
    return;
  }

  // ==== Cập nhật tiêu đề
  const titleCell = ws.getCell("A2");
  titleCell.value = `BẢNG THEO DÕI GIÁO VIÊN CHẤM BÀI KIỂM TRA ${tenKy} - KHỐI ${khoi} - NĂM HỌC ${namHoc}`;
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  const START_ROW = 4;
  let currentRow = START_ROW;

  // ==== Ghi dữ liệu lịch vào sheet
  data.forEach((item, index) => {
    const row = ws.getRow(currentRow++);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = item.hoTen;
    row.getCell(3).value = item.monDay;
    row.getCell(4).value = item.monCham;
    row.getCell(5).value = item.soLuong;
    row.getCell(6).value = item.hinhThuc;
    row.getCell(7).value = item.cachCham;
    row.getCell(8).value = item.tongSoBaiCham;
    row.getCell(9).value = item.ghiChu || "";
    row.eachCell({ includeEmpty: false }, (cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    row.commit();
  });

  // ==== Copy footer từ sheet "Assets"
  const footerStartRow = 9;
  const footerEndRow = 14;
  const targetRowStart = currentRow + 1;

  // ===== 1. Copy nội dung, style, chiều cao dòng =====
  for (let r = footerStartRow; r <= footerEndRow; r++) {
    const sourceRow = assetsSheet.getRow(r);
    const targetRow = ws.getRow(targetRowStart + (r - footerStartRow));

    sourceRow.eachCell({ includeEmpty: true }, (cell, col) => {
      const targetCell = targetRow.getCell(col);
      targetCell.value = cell.value;
      targetCell.style = { ...cell.style };
    });

    targetRow.height = sourceRow.height;
  }

  // ===== 2. Sao chép merged cells từ assets sang sheet chính =====
  const mergesMap = assetsSheet._merges;
  const mergesArray = assetsSheet.mergedCells;
  let mergeRanges = [];

  if (mergesMap && typeof mergesMap === "object") {
    const mergeKeys = Object.keys(mergesMap); // Ví dụ: ["A2:C2", "E4:E5", ...]

    mergeRanges = mergeKeys
      .map((rangeAddress) => {
        const mergeInfo = mergesMap[rangeAddress];

        if (!mergeInfo || !mergeInfo.model) return null;

        const { top, left, bottom, right } = mergeInfo.model;
        return { top, left, bottom, right };
      })
      .filter(Boolean);
  } else if (Array.isArray(mergesArray)) {
    mergeRanges = mergesArray.map((m) => ({
      top: m.start.row,
      bottom: m.end.row,
      left: m.start.column,
      right: m.end.column,
    }));
  } else {
    console.warn("Merged cells structure not available in assets sheet.");
  }

  // Áp dụng lại các merge nếu có giao với vùng footer
  mergeRanges.forEach(({ top, bottom, left, right }, idx) => {
    const overlapsFooter = !(bottom < footerStartRow || top > footerEndRow);

    if (overlapsFooter) {
      const offset = targetRowStart - footerStartRow;
      const newTop = top + offset;
      const newBottom = bottom + offset;
      ws.mergeCells(newTop, left, newBottom, right);
    }
  });
};

// === Tổng hợp xuất Excel ===
const ExportExcel = async ({
  kyInfo,
  dsHocSinh = [],
  lichThi = {},
  theoDoiCT = {},
  chamBai = {},
}) => {
  try {
    const wb = await loadWorkbookTemplate();

    const tenKyRaw = kyInfo?.a_ten_ky_kiem_tra || "";
    const isGiuaKy = /giữa/i.test(tenKyRaw);
    const isCuoiKy = /cuối/i.test(tenKyRaw);
    const tenKy = isGiuaKy ? "GIỮA KỲ" : isCuoiKy ? "CUỐI KỲ" : "KHÔNG RÕ";

    // Lấy khối từ chuỗi, ví dụ: "Khối 12"
    const khoi = /khối\s*(10|11|12)/i.exec(tenKyRaw)?.[1] || "Không rõ";

    // Ước lượng năm học dựa trên năm sinh học sinh đầu tiên
    const rawDate = dsHocSinh?.[0]?.a_ngay_sinh || "";
    const year = rawDate.split("-")[0] || new Date().getFullYear();
    const namHoc = `${year}-${+year + 1}`;

    const headerInfo = { tenKy, khoi, namHoc };

    buildSheetLich(
      wb,
      headerInfo,
      Array.isArray(lichThi.data) ? lichThi.data : []
    );
    buildSheetTheoDoiCT(
      wb,
      headerInfo,
      Array.isArray(theoDoiCT.data) ? theoDoiCT.data : [],
      theoDoiCT.column
    );
    buildSheetChamBai(
      wb,
      headerInfo,
      Array.isArray(chamBai.data) ? chamBai.data : []
    );

    // Xóa sheet Assets trước khi xuất
    wb.removeWorksheet("Assets");

    // Thực hiện xuất file Excel
    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "export-cham-cong.xlsx";
    link.click();
    console.log("Xuất file Excel thành công");
  } catch (errorFound) {
    console.error("exportExcel có lỗi:", errorFound);
  }
};

export default ExportExcel;

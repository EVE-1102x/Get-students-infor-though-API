import React, { useMemo, useImperativeHandle, forwardRef } from "react";
import { Table, Button } from "antd";
import { groupBy } from "lodash";
import ExcelJS from "exceljs";

function buildDynamicColumns(dsCaKiemTra = [], dsMonThi = []) {
  const caByNgay = groupBy(dsCaKiemTra, ca => ca.a_ngay_thi);
  const caByPhut = groupBy(dsCaKiemTra, ca => ca.a_so_phut);

  const caColumns = Object.entries(caByNgay).map(([ngay, caList]) => ({
    title: ngay,
    children: caList.map(ca => {
      const monKiemTra = dsMonThi
        .filter(m => m.ar_ca_thi?.[0]?.id === ca.id)
        .map(m => m.a_ten_mon_kiem_tra)
        .join("/");

      return {
        title: `${monKiemTra}\n${ca.a_gio_bat_dau} - ${ca.a_gio_ket_thuc}\n${ca.a_so_phut}ph`,
        dataIndex: `ca_${ca.id}`,
        key: `ca_${ca.id}`,
      };
    }),
  }));

  const tongColumns = Object.keys(caByPhut).map(soPhut => ({
    title: `TỔNG SỐ CA\n${soPhut}ph`,
    dataIndex: `tong_${soPhut}`,
    key: `tong_${soPhut}`,
  }));

  return [
    { title: "STT", dataIndex: "index", key: "index" },
    { title: "HỌ VÀ TÊN", dataIndex: "hoTen", key: "hoTen" },
    { title: "MÔN GIẢNG DẠY", dataIndex: "monGiangDay", key: "monGiangDay" },
    {
      title: "SỐ CA TRÔNG KIỂM TRA + TRỰC ĐỀ",
      children: [...caColumns, ...tongColumns],
    },
    { title: "GHI CHÚ", dataIndex: "ghiChu", key: "ghiChu" },
  ];
}

// Xuất Excel với header nhiều cấp
async function exportToExcelWithHeader(columns, data) {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet("Sheet1");

  // Độ sâu header
  function getDepth(cols) {
    if (!cols) return 0;
    const result = 1 + Math.max(0, ...cols.map(c => getDepth(c.children)));
    console.log("kết quả độ sâu header", result)
    return result
  }
  const depth = getDepth(columns);

  // Đếm số cột lá
  function countLeaf(cols) {
    const leaf = cols.reduce((sum, c) => sum + (c.children ? countLeaf(c.children) : 1), 0);
    console.log("kết quả đếm số cột lá", leaf)
    return leaf
  }

  // Mảng lưu thông tin merge
  const headerMatrix = Array.from({ length: depth }, () => []);

  function fillMatrix(cols, row = 0, colStart = 0) {
    cols.forEach(col => {
      const colSpan = col.children ? countLeaf(col.children) : 1;
      headerMatrix[row].push({
        title: col.title,
        rowStart: row + 1,
        rowEnd: col.children ? row + 1 : depth,
        colStart: colStart + 1,
        colEnd: colStart + colSpan
      });
      if (col.children) {
        fillMatrix(col.children, row + 1, colStart);
      }
      colStart += colSpan;
    });
  }

  fillMatrix(columns, 0, 0);

  // Ghi tiêu đề
  headerMatrix.forEach(row => {
    const excelRow = ws.addRow(row.map(c => c.title.replace(/\n/g, " ")));
    excelRow.height = 10;
  });

  // Merge + style tiêu đề
  headerMatrix.flat().forEach(cell => {
    if (cell.rowStart !== cell.rowEnd || cell.colStart !== cell.colEnd) {
      ws.mergeCells(cell.rowStart, cell.colStart, cell.rowEnd, cell.colEnd);
    }
    const excelCell = ws.getCell(cell.rowStart, cell.colStart);
    excelCell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    excelCell.font = { bold: true };
    excelCell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    };
  });

  // Lấy danh sách cột lá
  const leafColumns = [];
  function collectLeaf(cols) {
    cols.forEach(c => {
      if (c.children) collectLeaf(c.children);
      else leafColumns.push(c.dataIndex);
    });
  }
  collectLeaf(columns);

  // Đổ dữ liệu
  data.forEach(row => {
    const rowData = leafColumns.map(key => row[key] || "");
    ws.addRow(rowData);
  });

  // Auto width
  ws.columns.forEach(col => {
    let maxLength = 0;
    col.eachCell({ includeEmpty: true }, cell => {
      const val = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, val.length);
    });
    col.width = maxLength + 1;
  });

  // Xuất file
  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "export-table.xlsx";
  link.click();
}

const DynamicCaTable = forwardRef(function DynamicCaTable(
  { dsCaKiemTra = [], dsMonThi = [], dsGiaoVien = [], renderAction },
  ref
) {
  const excelColumns = useMemo(
    () => buildDynamicColumns(dsCaKiemTra, dsMonThi),
    [dsCaKiemTra, dsMonThi]
  );

  const tableColumns = useMemo(() => {
    if (!excelColumns || excelColumns.length === 0) return [];
    const addTableProps = cols =>
      cols.map(col => {
        if (col.children) {
          return { ...col, children: addTableProps(col.children) };
        }
        let render = text => text || "";
        if (col.dataIndex?.startsWith("tong_")) {
          render = text => <div style={{ color: "red" }}>{text || 0}</div>;
        }
        if (col.dataIndex === "index") {
          render = (_, __, idx) => idx + 1;
        }
        return { ...col, align: "center", width: 100, render };
      });
    return addTableProps(excelColumns);
  }, [excelColumns]);

  const dataSource = useMemo(() => {
    if (!dsGiaoVien || dsGiaoVien.length === 0) return [];
    return dsGiaoVien.map((gv, idx) => {
      const row = {
        index: idx + 1,
        hoTen: gv.hoTen,
        monGiangDay: gv.monGiangDay,
        ghiChu: gv.ghiChu,
      };

      dsCaKiemTra.forEach(ca => {
        row[`ca_${ca.id}`] = gv.caAssigned?.includes(ca.id) ? "1" : "";
      });

      const soPhutGroup = groupBy(dsCaKiemTra, c => c.a_so_phut);
      Object.keys(soPhutGroup).forEach(soPhut => {
        const caIDs = soPhutGroup[soPhut].map(c => c.id);
        row[`tong_${soPhut}`] = gv.caAssigned?.filter(id =>
          caIDs.includes(id)
        ).length || 0;
      });

      return row;
    });
  }, [dsGiaoVien, dsCaKiemTra]);

  // đặt tên là gì bây giờ?
  // useImperativeHandle là cái quái gì?
  useImperativeHandle(ref, () => ({
    getData: () => ({
      columns: excelColumns,
      data: dataSource,
    }),
  }));

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        {renderAction?.()}
        <Button
          type="primary"
          onClick={() => exportToExcelWithHeader(excelColumns, dataSource)}
          style={{ marginLeft: 10 }}
        >
          Xuất Excel
        </Button>
      </div>

      <Table
        scroll={{ y: 500, x: 1200 }}
        columns={tableColumns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        bordered
        rowKey={(_, index) => index}
      />
    </>
  );
});

export default DynamicCaTable;

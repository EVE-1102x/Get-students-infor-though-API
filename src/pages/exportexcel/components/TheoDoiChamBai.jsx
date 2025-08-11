import { useMemo, forwardRef, useImperativeHandle } from "react";
import { Table } from "antd";

const TheoDoiChamBai = (
  {
    dsMonThi = [],
    dsPhongThi = [],
    dsGiaoVien = [],
    dsHocSinhPhongThi = [],
  },
  ref
) => {
  const columns = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        align: "center",
        width: 60,
        render: (value, record, index) => index + 1,
      },
      {
        title: "HỌ TÊN GIÁO VIÊN",
        dataIndex: "hoTen",
        key: "hoTen",
        width: 200,
      },
      {
        title: "MÔN DẠY",
        dataIndex: "monDay",
        key: "monDay",
        width: 100,
        align: "center",
      },
      {
        title: "MÔN CHẤM",
        dataIndex: "monCham",
        key: "monCham",
        width: 100,
        align: "center",
      },
      {
        title: "SỐ LƯỢNG",
        dataIndex: "soLuong",
        key: "soLuong",
        width: 80,
        align: "center",
      },
      {
        title: "HÌNH THỨC",
        dataIndex: "hinhThuc",
        key: "hinhThuc",
        width: 120,
        align: "center",
      },
      {
        title: "CÁCH CHẤM",
        dataIndex: "cachCham",
        key: "cachCham",
        width: 100,
        align: "center",
      },
      {
        title: "TỔNG SỐ BÀI CHẤM",
        dataIndex: "tongSoBaiCham",
        key: "tongSoBaiCham",
        width: 120,
        align: "center",
        render: (text) => (
          <span style={{ color: "red", fontWeight: "bold" }}>{text}</span>
        ),
      },
      {
        title: "GHI CHÚ",
        dataIndex: "ghiChu",
        key: "ghiChu",
        width: 120,
        align: "center",
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        hoTen: "Nguyễn Văn A",
        monDay: "Toán",
        monCham: "Toán",
        soLuong: 30,
        hinhThuc: "Tự luận",
        cachCham: "Trực tiếp",
        tongSoBaiCham: 30,
        ghiChu: "",
      },
      {
        hoTen: "Trần Thị B",
        monDay: "Văn",
        monCham: "Văn",
        soLuong: 28,
        hinhThuc: "Tự luận",
        cachCham: "Tại nhà",
        tongSoBaiCham: 28,
        ghiChu: "Nộp trễ",
      },
      {
        hoTen: "Lê Văn C",
        monDay: "Tiếng Anh",
        monCham: "Tiếng Anh",
        soLuong: 32,
        hinhThuc: "Trắc nghiệm",
        cachCham: "Trực tiếp",
        tongSoBaiCham: 32,
        ghiChu: "",
      },
      {
        hoTen: "Phạm Thị D",
        monDay: "Lý",
        monCham: "Lý",
        soLuong: 25,
        hinhThuc: "Tự luận",
        cachCham: "Tại nhà",
        tongSoBaiCham: 25,
        ghiChu: "",
      },
      {
        hoTen: "Hoàng Văn E",
        monDay: "Hóa",
        monCham: "Sinh",
        soLuong: 20,
        hinhThuc: "Trắc nghiệm",
        cachCham: "Trực tiếp",
        tongSoBaiCham: 20,
        ghiChu: "Chấm thay",
      },
      {
        hoTen: "Đặng Thị F",
        monDay: "Lịch sử",
        monCham: "Lịch sử",
        soLuong: 27,
        hinhThuc: "Tự luận",
        cachCham: "Tại nhà",
        tongSoBaiCham: 27,
        ghiChu: "",
      },
      {
        hoTen: "Ngô Văn G",
        monDay: "Địa lý",
        monCham: "Địa lý",
        soLuong: 24,
        hinhThuc: "Tự luận",
        cachCham: "Trực tiếp",
        tongSoBaiCham: 24,
        ghiChu: "",
      },
      {
        hoTen: "Lý Thị H",
        monDay: "GDCD",
        monCham: "GDCD",
        soLuong: 22,
        hinhThuc: "Trắc nghiệm",
        cachCham: "Tại nhà",
        tongSoBaiCham: 22,
        ghiChu: "",
      },
      {
        hoTen: "Mai Văn I",
        monDay: "Công nghệ",
        monCham: "Công nghệ",
        soLuong: 18,
        hinhThuc: "Tự luận",
        cachCham: "Trực tiếp",
        tongSoBaiCham: 18,
        ghiChu: "",
      },
      {
        hoTen: "Bùi Thị J",
        monDay: "Tin học",
        monCham: "Tin học",
        soLuong: 26,
        hinhThuc: "Trắc nghiệm",
        cachCham: "Tại nhà",
        tongSoBaiCham: 26,
        ghiChu: "Chấm bổ sung",
      },
    ],
    []
  );

  useImperativeHandle(ref, () => ({
    getData: () => ({
      columns,
      data,
    }),
  }));

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        bordered
        rowKey={(_, index) => index}
      />
    </div>
  );
};

export default forwardRef(TheoDoiChamBai);

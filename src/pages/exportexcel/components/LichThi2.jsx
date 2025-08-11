import { useMemo, forwardRef, useImperativeHandle } from "react";
import { Table } from "antd";

const LichThi = (
  { dsHocSinhPhongThi = [], dsCaKiemTra = [], dsMonThi = [] },
  ref
) => {
  const columns = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "stt",
        key: "stt",
        width: 60,
        align: "center",
        render: (value, record, index) => index + 1,
      },
      {
        title: "NGÀY THÁNG",
        dataIndex: "ngayThang",
        key: "ngayThang",
        width: 120,
      },
      {
        title: "GIỜ",
        dataIndex: "gio",
        key: "gio",
        width: 200,
        align: "center",
      },
      {
        title: "THỜI GIAN",
        dataIndex: "thoiGian",
        key: "thoiGian",
        width: 100,
        align: "center",
      },
      {
        title: "MÔN",
        dataIndex: "mon",
        key: "mon",
        width: 100,
        align: "center",
      },
      {
        title: "SỐ LƯỢNG",
        dataIndex: "soLuong",
        key: "soLuong",
        width: 150,
        align: "center",
      },
      {
        title: "GHI CHÚ",
        dataIndex: "ghiChu",
        key: "ghiChu",
        width: 150,
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        ngayThang: "2025-08-01",
        gio: "08:00 - 10:00",
        thoiGian: "2h",
        mon: "Toán",
        soLuong: 30,
        ghiChu: "Kiểm tra giữa kỳ",
      },
      {
        ngayThang: "2025-08-02",
        gio: "10:15 - 12:15",
        thoiGian: "2h",
        mon: "Văn",
        soLuong: 28,
        ghiChu: "Thảo luận nhóm",
      },
      {
        ngayThang: "2025-08-03",
        gio: "13:00 - 15:00",
        thoiGian: "2h",
        mon: "Tiếng Anh",
        soLuong: 32,
        ghiChu: "Ôn tập từ vựng",
      },
      {
        ngayThang: "2025-08-04",
        gio: "15:15 - 17:15",
        thoiGian: "2h",
        mon: "Lý",
        soLuong: 29,
        ghiChu: "",
      },
      {
        ngayThang: "2025-08-05",
        gio: "08:00 - 10:00",
        thoiGian: "2h",
        mon: "Hóa",
        soLuong: 27,
        ghiChu: "Thực hành",
      },
      {
        ngayThang: "2025-08-06",
        gio: "10:15 - 12:15",
        thoiGian: "2h",
        mon: "Sinh",
        soLuong: 31,
        ghiChu: "Bài thuyết trình",
      },
      {
        ngayThang: "2025-08-07",
        gio: "13:00 - 15:00",
        thoiGian: "2h",
        mon: "Lịch sử",
        soLuong: 26,
        ghiChu: "Xem phim tư liệu",
      },
      {
        ngayThang: "2025-08-08",
        gio: "15:15 - 17:15",
        thoiGian: "2h",
        mon: "Địa lý",
        soLuong: 30,
        ghiChu: "",
      },
      {
        ngayThang: "2025-08-09",
        gio: "08:00 - 10:00",
        thoiGian: "2h",
        mon: "GDCD",
        soLuong: 28,
        ghiChu: "Thảo luận xã hội",
      },
      {
        ngayThang: "2025-08-10",
        gio: "10:15 - 12:15",
        thoiGian: "2h",
        mon: "Công nghệ",
        soLuong: 25,
        ghiChu: "Lắp ráp mạch điện",
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

export default forwardRef(LichThi);

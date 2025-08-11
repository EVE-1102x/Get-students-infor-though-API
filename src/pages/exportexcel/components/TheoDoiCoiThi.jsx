import { useMemo, forwardRef, useImperativeHandle } from "react";
import { Table } from "antd";
import { groupBy } from "lodash";

const TheoDoiCoiThi = ({ renderAction }, ref) => {
  // === DỮ LIỆU MẪU ===
  const dsCaKiemTra = [
    {
      id: 1,
      a_ngay_thi: "2025-08-03",
      a_gio_bat_dau: "15:00",
      a_gio_ket_thuc: "17:00",
      a_so_phut: 60,
    },
    {
      id: 2,
      a_ngay_thi: "2025-08-06",
      a_gio_bat_dau: "12:00",
      a_gio_ket_thuc: "14:00",
      a_so_phut: 120,
    },
    {
      id: 3,
      a_ngay_thi: "2025-08-02",
      a_gio_bat_dau: "11:00",
      a_gio_ket_thuc: "13:00",
      a_so_phut: 90,
    },
    {
      id: 4,
      a_ngay_thi: "2025-08-08",
      a_gio_bat_dau: "09:00",
      a_gio_ket_thuc: "11:00",
      a_so_phut: 60,
    },
  ];

  const dsMonThi = [
    { a_ten_mon_kiem_tra: "Sinh", ar_ca_thi: [{ id: 1 }] },
    { a_ten_mon_kiem_tra: "Hóa", ar_ca_thi: [{ id: 1 }] },
    { a_ten_mon_kiem_tra: "Sinh", ar_ca_thi: [{ id: 2 }] },
    { a_ten_mon_kiem_tra: "Lý", ar_ca_thi: [{ id: 3 }] },
    { a_ten_mon_kiem_tra: "Sinh", ar_ca_thi: [{ id: 3 }] },
    { a_ten_mon_kiem_tra: "Toán", ar_ca_thi: [{ id: 4 }] },
    { a_ten_mon_kiem_tra: "Văn", ar_ca_thi: [{ id: 4 }] },
  ];

  const dsGiaoVien = [
    {
      hoTen: "Nguyễn Văn A",
      monGiangDay: "Toán",
      ghiChu: "Có ca thi ngày 03 & 08",
      caAssigned: [1, 4],
    },
    {
      hoTen: "Trần Thị B",
      monGiangDay: "Văn",
      ghiChu: "Chỉ 1 ca",
      caAssigned: [2],
    },
    {
      hoTen: "Lê Văn C",
      monGiangDay: "Lý",
      ghiChu: "",
      caAssigned: [1, 2, 3, 4],
    },
    {
      hoTen: "Phạm Thị D",
      monGiangDay: "Hóa",
      ghiChu: "Trực đề 03/08",
      caAssigned: [4],
    },
    {
      hoTen: "Võ Văn E",
      monGiangDay: "Sinh",
      ghiChu: "Chấm môn Sinh",
      caAssigned: [1, 2],
    },
    {
      hoTen: "Đỗ Thị F",
      monGiangDay: "Vật lý",
      ghiChu: "Full lịch thi",
      caAssigned: [1, 2, 3, 4],
    },
    {
      hoTen: "Ngô Văn G",
      monGiangDay: "GDCD",
      ghiChu: "Không có ca nào",
      caAssigned: [],
    },
  ];

  // === COLUMNS ===
  const columns = useMemo(() => {
    const caByNgay = groupBy(dsCaKiemTra, (ca) => ca.a_ngay_thi);
    const caByPhut = groupBy(dsCaKiemTra, (ca) => ca.a_so_phut);

    const caColumns = Object.entries(caByNgay).map(([ngay, caList]) => ({
      title: ngay,
      children: caList.map((ca) => {
        const monKiemTra = dsMonThi
          .filter((m) => m.ar_ca_thi?.[0]?.id === ca.id)
          .map((m) => m.a_ten_mon_kiem_tra)
          .join("/");
        return {
          title: (
            <div>
              <div>{monKiemTra}</div>
              <div>
                {ca.a_gio_bat_dau} - {ca.a_gio_ket_thuc}
              </div>
              <div>{ca.a_so_phut}ph</div>
            </div>
          ),
          dataIndex: `ca_${ca.id}`,
          key: `ca_${ca.id}`,
          align: "center",
          width: 100,
          render: (text) => text || "",
        };
      }),
    }));

    const tongColumns = Object.keys(caByPhut).map((soPhut) => ({
      title: (
        <div>
          TỔNG SỐ CA
          <br />
          {soPhut}ph
        </div>
      ),
      dataIndex: `tong_${soPhut}`,
      key: `tong_${soPhut}`,
      align: "center",
      width: 80,
      render: (text) => <div style={{ color: "red" }}>{text || 0}</div>,
    }));

    return [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        align: "center",
        width: 60,
        render: (_, __, idx) => idx + 1,
      },
      { title: "HỌ VÀ TÊN", dataIndex: "hoTen", key: "hoTen", width: 200 },
      {
        title: "MÔN GIẢNG DẠY",
        dataIndex: "monGiangDay",
        key: "monGiangDay",
        align: "center",
        width: 150,
      },
      {
        title: "SỐ CA TRÔNG KIỂM TRA + TRỰC ĐỀ",
        children: [...caColumns, ...tongColumns],
      },
      {
        title: "GHI CHÚ",
        dataIndex: "ghiChu",
        key: "ghiChu",
        align: "center",
        width: 150,
      },
    ];
  }, [dsCaKiemTra, dsMonThi]);

  // === DATA ===
  const dataSource = useMemo(() => {
    return dsGiaoVien.map((gv) => {
      const row = {
        hoTen: gv.hoTen,
        monGiangDay: gv.monGiangDay,
        ghiChu: gv.ghiChu,
      };

      dsCaKiemTra.forEach((ca) => {
        const thamGia = gv.caAssigned.includes(ca.id);
        row[`ca_${ca.id}`] = thamGia ? "1" : "";
      });

      const soPhutGroup = groupBy(dsCaKiemTra, (c) => c.a_so_phut);
      Object.keys(soPhutGroup).forEach((soPhut) => {
        const caIDs = soPhutGroup[soPhut].map((c) => c.id);
        row[`tong_${soPhut}`] = gv.caAssigned.filter((id) =>
          caIDs.includes(id)
        ).length;
      });

      return row;
    });
  }, [dsGiaoVien, dsCaKiemTra]);

  // === FORWARD REF: expose getData() ===
  useImperativeHandle(ref, () => ({
    getData: () => ({
      columns,
      data: dataSource,
    }),
  }));

  return (
    <>
      <div>{renderAction?.()}</div>
      <Table
        scroll={{ y: 500, x: 1200 }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        bordered
        rowKey={(_, index) => index}
      />
    </>
  );
};

export default forwardRef(TheoDoiCoiThi);

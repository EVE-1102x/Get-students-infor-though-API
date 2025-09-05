// === DỮ LIỆU GIẢ TEST ===
export const dsCaKiemTraFake = [
  {
    id: 1,
    a_ngay_thi: "2025-08-15",
    a_gio_bat_dau: "08:00",
    a_gio_ket_thuc: "09:00",
    a_so_phut: 60,
  },
  {
    id: 2,
    a_ngay_thi: "2025-08-15",
    a_gio_bat_dau: "09:15",
    a_gio_ket_thuc: "10:15",
    a_so_phut: 60,
  },
  {
    id: 3,
    a_ngay_thi: "2025-08-16",
    a_gio_bat_dau: "08:00",
    a_gio_ket_thuc: "09:30",
    a_so_phut: 90,
  },
  {
    id: 4,
    a_ngay_thi: "2025-08-16",
    a_gio_bat_dau: "10:00",
    a_gio_ket_thuc: "11:30",
    a_so_phut: 90,
  },
];

export const dsMonThiFake = [
  {
    a_ten_mon_kiem_tra: "Toán",
    ar_ca_thi: [{ id: 1 }],
  },
  {
    a_ten_mon_kiem_tra: "Văn",
    ar_ca_thi: [{ id: 2 }],
  },
  {
    a_ten_mon_kiem_tra: "Anh",
    ar_ca_thi: [{ id: 3 }],
  },
  {
    a_ten_mon_kiem_tra: "Lý",
    ar_ca_thi: [{ id: 4 }],
  },
];

export const dsGiaoVienFake = [
  {
    hoTen: "Nguyễn Văn A",
    monGiangDay: "Toán",
    ghiChu: "",
    caAssigned: [1, 3],
  },
  {
    hoTen: "Trần Thị B",
    monGiangDay: "Văn",
    ghiChu: "Dạy bồi dưỡng",
    caAssigned: [2, 4],
  },
  {
    hoTen: "Lê Văn C",
    monGiangDay: "Anh",
    ghiChu: "",
    caAssigned: [1, 2, 3],
  },
];

import DynamicCaTable from "./dynamiccatable";
import {
  dsCaKiemTraFake,
  dsMonThiFake,
  dsGiaoVienFake
} from "./fakedata";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Bảng Ca Kiểm Tra (Test dữ liệu giả)</h2>
      <DynamicCaTable
        dsCaKiemTra={dsCaKiemTraFake}
        dsMonThi={dsMonThiFake}
        dsGiaoVien={dsGiaoVienFake}
      />
    </div>
  );
}

import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { Card, Row, Col, Select, Tabs, Spin } from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

// Dynamic import
const LichThi = lazy(() => import("./components/LichThi2"));
const TheoDoiCoiThi = lazy(() => import("./components/TheoDoiCoiThi"));
const TheoDoiChamBai = lazy(() => import("./components/TheoDoiChamBai"));

// Lấy tất cả file JS trong thư mục components
const modules = import.meta.glob("./components/*.jsx");

// Dropdown options
const options = Object.keys(modules).map((path) => {
  const match = path.match(/components\/(.+)\.jsx$/);
  return {
    label: match ? match[1] : path,
    value: path,
    key: path,
  };
});

function RenderTable() {
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [demoData, setDemoData] = useState([]);
  const [state, _setState] = useState({
    tab: "lich",
    loading: false,
    dsCaKiemTra: [],
    dsMonThi: [],
    dsPhongThi: [],
    dsGiaoVien: [],
    dsHocSinhPhongThi: [],
  });

  const setState = (data) => _setState((prev) => ({ ...prev, ...data }));

  // Đưa các ref ra ngoài để đảm bảo consistent
  const refLichThi = useRef();
  const refTheoDoiCT = useRef();
  const refChamBai = useRef();

  // Import data mẫu khi chọn file
  useEffect(() => {
    if (!selectedFilePath) return;

    const importData = async () => {
      setState({ loading: true });
      const module = await modules[selectedFilePath]();
      const data = module.demoData || {};

      setDemoData(data);

      setState({
        dsCaKiemTra: data.dsCaKiemTra || [],
        dsMonThi: data.dsMonThi || [],
        dsPhongThi: data.dsPhongThi || [],
        dsGiaoVien: data.dsGiaoVien || [],
        dsHocSinhPhongThi: data.dsHocSinhPhongThi || [],
        loading: false,
      });
    };

    importData();
  }, [selectedFilePath]);

  // 🧩 Render từng tab content
  const renderTabContent = () => {
    if (!selectedFilePath) {
      return (
        <div style={{ padding: 24, textAlign: "center" }}>
          Vui lòng chọn file dữ liệu mẫu
        </div>
      );
    }

    return (
      <Suspense fallback={<Spin />}>
        {/* LichThi tab */}
        <div style={{ display: state.tab === "lich" ? "block" : "none" }}>
          <LichThi
            ref={refLichThi}
            dsHocSinhPhongThi={state.dsHocSinhPhongThi}
            dsCaKiemTra={state.dsCaKiemTra}
            dsMonThi={state.dsMonThi}
          />
        </div>

        {/* Theo Doi Coi Thi tab */}
        <div style={{ display: state.tab === "theoDoiCT" ? "block" : "none" }}>
          <TheoDoiCoiThi
            ref={refTheoDoiCT}
            dsCaKiemTra={state.dsCaKiemTra}
            dsMonThi={state.dsMonThi}
            dsPhongThi={state.dsPhongThi}
            dsGiaoVien={state.dsGiaoVien}
          />
        </div>

        {/* Theo Doi Cham Bai tab */}
        <div
          style={{ display: state.tab === "theoDoiChamBai" ? "block" : "none" }}
        >
          <TheoDoiChamBai
            ref={refChamBai}
            dsHocSinhPhongThi={state.dsHocSinhPhongThi}
            dsMonThi={state.dsMonThi}
            dsPhongThi={state.dsPhongThi}
            dsGiaoVien={state.dsGiaoVien}
          />
        </div>
      </Suspense>
    );
  };

  const tabItems = [
    {
      key: "lich",
      label: (
        <span>
          <CalendarOutlined />
          LỊCH
        </span>
      ),
    },
    {
      key: "theoDoiCT",
      label: (
        <span>
          <EyeOutlined />
          THEO DÕI COI THI
        </span>
      ),
    },
    {
      key: "theoDoiChamBai",
      label: (
        <span>
          <CheckCircleOutlined />
          THEO DÕI CHẤM BÀI
        </span>
      ),
    },
  ];

  // 🧾 Export Excel
  const handleExportExcel = async () => {
    const ExportExcel = (await import("./export")).default;

    const mockKyInfo = { a_ten_ky_kiem_tra: "Kiểm tra giữa kỳ khối 11" };
    const mockDsHocSinh = [{ a_ngay_sinh: "2008-09-10" }];

    const theoDoiCTData = refTheoDoiCT.current?.getData?.();
    const chamBaiData = refChamBai.current?.getData?.();
    const lichThiData = refLichThi.current?.getData?.();

    await ExportExcel({
      kyInfo: mockKyInfo,
      dsHocSinh: mockDsHocSinh,
      lichThi: lichThiData,
      theoDoiCT: theoDoiCTData,
      chamBai: chamBaiData,
    });

    console.log("Dữ liệu theoDoiCTData gửi đi: ", theoDoiCTData);
    console.log("Dữ liệu chamBaiData gửi đi: ", chamBaiData);
    console.log("Dữ liệu lichThiData gửi đi: ", lichThiData);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn file dữ liệu mẫu"
              onChange={(val) => setSelectedFilePath(val)}
              options={options}
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Col>
          <Col>
            <button type="button" onClick={handleExportExcel}>
              Xuất file Excel
            </button>
          </Col>
        </Row>

        <Tabs
          activeKey={state.tab}
          onChange={(tab) => setState({ tab })}
          type="card"
          size="large"
          items={tabItems}
        />

        <Spin spinning={state.loading}>
          <Card style={{ marginTop: 24 }}>
            <Suspense fallback={<Spin />}>{renderTabContent()}</Suspense>
          </Card>
        </Spin>
      </Card>
    </div>
  );
}

export default RenderTable;

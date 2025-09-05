import { useMemo, useState } from "react";
import { Card, Table, Spin, Select, Button, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./Timetable.css";

function Timetable() {
  const [loading] = useState(false);
  const [selectedTKB, setSelectedTKB] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  /** ---------------- COLUMNS ---------------- */
  const columns = useMemo(
    () => [
      {
        title: "Buổi",
        dataIndex: "buoi",
        key: "buoi",
        width: 80,
        align: "center",
        fixed: "left",
        onCell: (_, index) => {
          if (index % 5 === 0) {
            return { rowSpan: 5, className: "col-buoi-tiet" };
          }
          return { rowSpan: 0 };
        },
      },
      {
        title: "Tiết",
        dataIndex: "tiet",
        key: "tiet",
        width: 60,
        align: "center",
        fixed: "left",
        onCell: () => ({ className: "col-buoi-tiet" }),
      },
      ...["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"].map((day, i) => ({
        title: day,
        dataIndex: `thu${i + 2}`,
        key: `thu${i + 2}`,
        width: 140,
        align: "center",
        onCell: () => ({ className: `col-thu${i + 2}` }),
      })),
    ],
    []
  );

  /** ---------------- DATA ---------------- */
  const data = useMemo(() => {
    const subjects = [
      "Toán",
      "Văn",
      "Anh",
      "Lý",
      "Hóa",
      "Sinh",
      "Sử",
      "Địa",
      "Tin",
      "GDCD",
      "Công nghệ",
      "Thể dục",
    ];

    const sessions = ["Sáng", "Chiều"];
    const result = [];
    let keyCounter = 1;

    for (const buoi of sessions) {
      for (let tiet = 1; tiet <= 5; tiet++) {
        const row = { key: String(keyCounter++), buoi, tiet };

        for (let d = 0; d < 5; d++) {
          row[`thu${d + 2}`] =
            subjects[(tiet + d + keyCounter) % subjects.length];
        }

        if (buoi === "Chiều" && tiet === 5) {
          row.isLastOfDay = true;
        }
        result.push(row);
      }
    }
    return result;
  }, []);

  /** ---------------- ROW CLASS ---------------- */
  const rowClassName = (record, index) => {
    const dayIndex = Math.floor(index / 10); // 0=Thứ 2, 1=Thứ 3,...
    let base = "";
    switch (dayIndex) {
      case 0:
        base = "row-thu2";
        break;
      case 1:
        base = "row-thu3";
        break;
      case 2:
        base = "row-thu4";
        break;
      case 3:
        base = "row-thu5";
        break;
      case 4:
        base = "row-thu6";
        break;
      default:
        break;
    }
    return record.isLastOfDay ? `${base} row-last-of-day` : base;
  };

  /** ---------------- HANDLERS ---------------- */
  function handleImportExcel() {
    console.log("vào thành công");
  }

  /** ---------------- OPTIONS ---------------- */
  const tkbOptions = [
    { label: "TKB Học kỳ 1", value: "tkb_hk1" },
    { label: "TKB Học kỳ 2", value: "tkb_hk2" },
  ];

  const classOptions = [
    { label: "Lớp 10A1", value: "10A1" },
    { label: "Lớp 10A2", value: "10A2" },
    { label: "Lớp 11B1", value: "11B1" },
    { label: "Lớp 11B2", value: "11B2" },
    { label: "Lớp 12C1", value: "12C1" },
    { label: "Lớp 12C2", value: "12C2" },
  ];

  /** ---------------- RENDER ---------------- */
  return (
    <div style={{ padding: 24 }}>
      <Card style={{ height: "90vh" }}>
        {/* Bộ lọc */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Space style={{ flex: 1 }}>
            <Select
              style={{ minWidth: 200 }}
              placeholder="Chọn TKB"
              value={selectedTKB}
              onChange={(val) => {
                setSelectedTKB(val);
                setSelectedClass(null); // reset lớp khi đổi TKB
              }}
              options={tkbOptions}
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />

            <Select
              style={{ minWidth: 200 }}
              placeholder={selectedTKB ? "Chọn lớp" : "Chọn TKB trước"}
              value={selectedClass}
              onChange={(val) => setSelectedClass(val)}
              options={classOptions}
              showSearch
              disabled={!selectedTKB} // disable hoàn toàn nếu chưa chọn TKB
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Space>

          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleImportExcel}
          />
        </div>

        {/* Bảng */}
        <Spin spinning={loading}>
          <Table
            className="custom-table-scroll"
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            scroll={{ x: 1600, y: "calc(100vh - 200px)" }}
            rowClassName={rowClassName}
          />
        </Spin>
      </Card>
    </div>
  );
}

export default Timetable;

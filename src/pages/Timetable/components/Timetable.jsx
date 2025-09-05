import { useMemo, useState } from "react";
import { Card, Table, Spin } from "antd";
import "./Timetable.css";

function Timetable() {
  const [loading] = useState(false);

  const columns = useMemo(
    () => [
      {
        title: "Thứ",
        dataIndex: "thu",
        key: "thu",
        width: 80,
        align: "center",
        onCell: (_, index) => {
          if (index % 10 === 0) {
            // Cell này là "Thứ" (rowSpan=10)
            return {
              rowSpan: 10,
              className: "last-day-cell", // luôn gắn class để có border đậm cuối block
            };
          }
          return { rowSpan: 0 };
        },
        fixed: "left",
      },
      {
        title: "Buổi",
        dataIndex: "buoi",
        key: "buoi",
        width: 80,
        align: "center",
        onCell: (record, index) => {
          // Mỗi buổi có 5 tiết
          if (index % 5 === 0) {
            return {
              rowSpan: 5,
              className: record.isStartOfLastSession ? "last-day-cell" : "",
            };
          }
          return { rowSpan: 0 };
        },
        fixed: "left",
      },
      {
        title: "Tiết",
        dataIndex: "tiet",
        key: "tiet",
        width: 60,
        align: "center",
        fixed: "left",
      },
      ...Array.from({ length: 8 }, (_, i) => ({
        title: `10A${i + 1}`,
        dataIndex: `a${i + 1}`,
        key: `a${i + 1}`,
        width: 120,
        align: "center",
      })),
    ],
    []
  );

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

    const result = [];
    let keyCounter = 1;

    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"];
    const sessions = ["Sáng", "Chiều"];

    for (const thu of days) {
      for (const buoi of sessions) {
        for (let tiet = 1; tiet <= 5; tiet++) {
          const row = { key: String(keyCounter++), thu, buoi, tiet };
          for (let j = 1; j <= 8; j++) {
            row[`a${j}`] = subjects[(tiet + j + keyCounter) % subjects.length];
          }

          // Hàng cuối ngày (tiết 5 chiều)
          if (buoi === "Chiều" && tiet === 5) {
            row.isLastOfDay = true;
            row.isLastOfDayHeader = true; // thêm flag cho cell Thứ
          }

          // Cell đầu buổi chiều (để cột "Buổi" ăn border dưới)
          if (buoi === "Chiều" && tiet === 1) {
            row.isStartOfLastSession = true;
          }

          result.push(row);
        }
      }
    }

    return result;
  }, []);

  const rowClassName = (record) => {
    let base = "";
    switch (record.thu) {
      case "Thứ 2":
        base = "row-thu2";
        break;
      case "Thứ 3":
        base = "row-thu3";
        break;
      case "Thứ 4":
        base = "row-thu4";
        break;
      case "Thứ 5":
        base = "row-thu5";
        break;
      case "Thứ 6":
        base = "row-thu6";
        break;
      default:
        break;
    }
    return record.isLastOfDay ? `${base} row-last-of-day` : base;
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ height: "90vh" }}>
        <Spin spinning={loading}>
          <Table
            className="custom-table-scroll"
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            scroll={{ x: 1600, y: "calc(100vh - 150px)" }}
            rowClassName={rowClassName}
          />
        </Spin>
      </Card>
    </div>
  );
}

export default Timetable;

import { Column } from "@ant-design/plots";
import { Button, Form, Input, Table, Select } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

function GradeFetcher() {
  const [data, setData] = useState([]);
  const [formValues, setFormValues] = useState(null); // giữ examTerm + grade
  const BASE_URL = "http://localhost:3002/examTerms";

  // Lấy dữ liệu API dựa vào input người dùng
  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          examTerm: values.examTerm,
          grade: values.grade,
        },
      });
      setData(response.data);
      setFormValues(values); // lưu lại để tái sử dụng bên ngoài
      console.log("API nhận về:", response.data);
      console.log("Dữ liệu gửi:", values);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  // Dùng Ant Design config dữ liệu cho chart
  const config = {
    data,
    xField: "subject",
    yField: "attendanceAmount",
    colorField: "gradeBand",
    stack: {
      groupBy: ["x", "series"],
      series: false,
    },
    tooltip: {
      title: () =>
        formValues
          ? `Kỳ: ${formValues.examTerm} - Khối: ${formValues.grade}`
          : "Chưa chọn",
    },

    interaction: {
      tooltip: {
        render: (e, { title, items }) => (
          <div>
            <h4>{title}</h4>
            {items.map((item, idx) => {
              const { name, color, origin } = item;
              return (
                <div key={idx}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: color,
                          marginRight: 6,
                        }}
                      />
                      <span>
                        {origin["gradeBand"]} - {name}
                      </span>
                    </div>
                    <b>{origin["attendanceAmount"]}</b>
                  </div>
                </div>
              );
            })}
          </div>
        ),
      },
    },
  };

  // Dùng Ant Design config dữ liệu cho table
  const columns = [
    {
      title: "Môn",
      dataIndex: "subject",
      key: "subject",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Điểm cao nhất",
      dataIndex: "highestGrade",
      key: "highestGrade",
      width: 80,
    },
    {
      title: "SL HS đạt",
      dataIndex: "highestGradeAmount",
      key: "highestGradeAmount",
      width: 70,
    },
    {
      title: ">= 9.0",
      dataIndex: "nineOrAbove",
      key: "nineOrAbove",
      width: 70,
    },
    {
      title: "8.0 - 8.9",
      dataIndex: "eightToNine",
      key: "eightToNine",
      width: 70,
    },
    {
      title: "7.0 - 7.9",
      dataIndex: "sevenToEight",
      key: "sevenToEight",
      width: 70,
    },
    {
      title: "6.0 - 6.9",
      dataIndex: "sixToSeven",
      key: "sixToSeven",
      width: 70,
    },
    {
      title: "5.0 - 5.9",
      dataIndex: "fiveToSix",
      key: "fiveToSix",
      width: 70,
    },
    {
      title: "4.0 - 4.9",
      dataIndex: "fourToFive",
      key: "fourToFive",
      width: 70,
    },
    {
      title: "3.0 - 3.9",
      dataIndex: "threeToFour",
      key: "threeToFour",
      width: 70,
    },
    {
      title: "2.0 - 2.9",
      dataIndex: "twoToThree",
      key: "twoToThree",
      width: 70,
    },
    {
      title: "1.0 - 1.9",
      dataIndex: "oneToTwo",
      key: "oneToTwo",
      width: 70,
    },
    {
      title: "<= 1.0",
      dataIndex: "oneOrBelow",
      key: "oneOrBelow",
      width: 70,
    },
    {
      title: "Số HS KT",
      dataIndex: "attendanceAmount",
      key: "attendanceAmount",
      width: 90,
    },
    {
      title: "Số HS Vắng KT",
      dataIndex: "missing",
      key: "missing",
      width: 80,
    },
    {
      title: "Điểm TB của HS",
      dataIndex: "averageGrade",
      key: "averageGrade",
      width: 100,
      render: (value) => value.toFixed(2), // làm tròn nếu cần
    },
  ];

  return (
    <div className="testimonial-grid !p-2">
      <Form
        initialValues={{
          grade: "10",
          examTerm: "midterm1",
        }}
        onFinish={handleFormSubmit}
      >
        <div className="testimonial flex gap-4">
          <fieldset className="w-1/4 !border !border-white !p-2 !rounded !h-fit">
            <legend className="!text-sm !w-fit">Kỳ kiểm tra</legend>
            <Form.Item name="examTerm" placeholder="Lựa chọn kỳ kiểm tra">
              <Select className="w-full">
                <Select.Option value="midterm1">
                  Kiểm tra giữa Học Kì I - THPT
                </Select.Option>
                <Select.Option value="final1">
                  Kiểm tra cuối Học Kì I - THPT
                </Select.Option>
                <Select.Option value="midterm2">
                  Kiểm tra giữa Học Kì II - THPT
                </Select.Option>
                <Select.Option value="final2">
                  Kiểm tra cuối Học Kì II - THPT
                </Select.Option>
              </Select>
            </Form.Item>
          </fieldset>

          <fieldset className="w-1/4 !border !border-white !p-2 !rounded !h-fit">
            <legend className="!text-sm !w-fit">Khối</legend>
            <Form.Item name="grade" placeholder="Lựa chọn khối">
              <Select className="w-full">
                <Select.Option value="10">Khối 10</Select.Option>
                <Select.Option value="11">Khối 11</Select.Option>
                <Select.Option value="12">Khối 12</Select.Option>
              </Select>
            </Form.Item>
          </fieldset>

          <Button
            htmlType="submit"
            className="!ml-auto !self-center !font-bold !py-6 !px-15 !border-3 !border-blue-400 !bg-transparent !text-blue-400 hover:!bg-blue-400 hover:!text-white"
          >
            XÁC NHẬN
          </Button>
        </div>
      </Form>

      <div className="testimonial">
        <Column {...config} />
      </div>

      <div className="testimonial">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          bordered
          size="small"
          rowKey="subject"
          scroll={{ x: "max-content" }}
          sticky
        />
      </div>
    </div>
  );
}

export default GradeFetcher;

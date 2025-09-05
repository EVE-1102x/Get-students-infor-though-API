import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Button, Space, Typography } from "antd";
import "antd/dist/reset.css";
import "./App.css";

// Dynamic import
const FetchAPIStudents = lazy(() => import("@/pages/apistudents"));
const ExportExcel = lazy(() => import("@/pages/exportExcel"));
const PureUseState = lazy(() => import("@/pages/PureJS/pureUseState"));
const LearnUseState = lazy(() => import("@/pages/learnUseState"));
const LearnUseEffect = lazy(() => import("@/pages/learnUseEffect"));
const DynamicCaTable = lazy(() => import("@/pages/dynamicCaTable"));
const Timetable = lazy(() => import("@/pages/Timetable"));

function App() {
  return (
    <Suspense fallback={<div>Đang tải dữ liệu...</div>}>
      <Routes>
        <Route path="/students" element={<FetchAPIStudents />} />
        <Route path="/exportexcel" element={<ExportExcel />} />
        <Route path="/pureUseState" element={<PureUseState />} />
        <Route path="/learnusestate" element={<LearnUseState />} />
        <Route path="/learnuseeffect" element={<LearnUseEffect />} />
        <Route path="/dynamictable" element={<DynamicCaTable />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route
          path="/"
          element={
            <div style={{ padding: 24 }}>
              <Typography.Title level={3} className="!text-color">
                Home - Danh sách trang
              </Typography.Title>

              <Space direction="vertical" style={{ width: "200px" }}>
                <Link to="/students">
                  <Button type="primary" block>
                    Students
                  </Button>
                </Link>
                <Link to="/exportexcel">
                  <Button type="default" block>
                    Export Excel
                  </Button>
                </Link>
                <Link to="/pureUseState">
                  <Button type="dashed" block>
                    Pure UseState
                  </Button>
                </Link>
                <Link to="/learnusestate">
                  <Button type="primary" ghost block>
                    Learn UseState
                  </Button>
                </Link>
                <Link to="/learnuseeffect">
                  <Button type="default" ghost block>
                    Learn UseEffect
                  </Button>
                </Link>
                <Link to="/dynamictable">
                  <Button danger block>
                    Dynamic Table
                  </Button>
                </Link>
                <Link to="/timetable">
                  <Button type="primary" block>
                    Timetable
                  </Button>
                </Link>
              </Space>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;

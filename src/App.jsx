import { useEffect, useMemo, lazy, Suspense } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "antd/dist/reset.css";
import "./App.css";

// Dynamic import
const FetchAPIStudents = lazy(() => import("@/pages/apistudents"));
const ExportExcel = lazy(() => import("@/pages/exportexcel"));
const Training = lazy(() => import("@/pages/training"));
const LearnUseState = lazy(() => import("@/pages/learnusestate"));
const LearnUseEffect = lazy(() => import("@/pages/learnuseeffect"))

function App() {
  return (
    <Suspense fallback={<div>Đang tải dữ liệu...</div>}>
      <Routes>
        <Route path="/students" element={<FetchAPIStudents />} />
        <Route path="/exportexcel" element={<ExportExcel />} />
        <Route path="/training" element={<Training />} />
        <Route path="/learnusestate" element={<LearnUseState/>} />
        <Route path="/learnuseeffect" element={<LearnUseEffect/>} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;

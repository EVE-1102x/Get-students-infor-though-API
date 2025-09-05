import { useState } from "react";
import FetchAPI from "./components/fetchapi";
import WindowWidth from "./components/windowwidth";

function ComponentsIndex() {
  const [component, setComponent] = useState("fetchapi");

  const renderComponent = () => {
    switch (component) {
      case "fetchapi":
        return <FetchAPI />;
      case "windowwidth":
        return <WindowWidth />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button className="border border-gray-500 rounded px-4 py-2"
          onClick={() => setComponent("fetchapi")}>
          FetchAPI
        </button>
        <button className="border border-blue-500 rounded px-4 py-2"
          onClick={() => setComponent("windowwidth")}>
          WindowWidth
        </button>
      </div>

      {renderComponent()}
    </div>
  );
}

export default ComponentsIndex
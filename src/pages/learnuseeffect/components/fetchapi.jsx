import React, { useState, useEffect } from "react";

function learnUseEffect() {
  // Nếu giá trị setResourceType mới trùng với giá trị cũ, React sẽ không render lại
  const [resourceType, setResourceType] = useState("posts");
  const [items, setItems] = useState([]);

  // Do đó dòng này chỉ được gọi khi setResourceType
  // Nhận được một giá trị mới, không trùng khớp với giá trị cũ
  console.log("render");

  // Nếu bạn chỉ muốn gọi effect 1 lần duy nhất làm như sau
  useEffect(() => {
    console.log("Tôi chỉ được gọi một lần vì điều kiện là []");
  }, []);

  // Effect sẽ chỉ được gọi nếu giá trị resourceType thay đổi
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/${resourceType}`)
      .then((response) => response.json())
      .then(json => setItems(json));

    return () => {
        console.log("return from resource change")
    }
  }, [resourceType]);

  return (
    <>
      <div className="flex gap-2">
        <button
          className="border border-gray-500 rounded px-4 py-2"
          onClick={() => setResourceType("posts")}
        >
          Posts
        </button>
        <button
          className="border border-blue-500 rounded px-4 py-2"
          onClick={() => setResourceType("users")}
        >
          Users
        </button>
        <button
          className="border border-green-500 rounded px-4 py-2"
          onClick={() => setResourceType("comments")}
        >
          Comments
        </button>
      </div>

      <h1>{resourceType}</h1>
      {items.map(item => {
        return <pre>{JSON.stringify(item)}</pre>
      })}
    </>
  );
}

export default learnUseEffect;

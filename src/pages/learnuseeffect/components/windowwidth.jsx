import React, { useState, useEffect } from "react";

function windowwidth() {
  // Nếu giá trị setResourceType mới trùng với giá trị cũ, React sẽ không render lại
  const [windowwidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  // Effect sẽ chỉ được gọi nếu giá trị resourceType thay đổi
  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
        console.log("return window width has changed")
    }
  }, []);

  return (
    <div>
        {windowwidth}
    </div>
  );
}

export default windowwidth;

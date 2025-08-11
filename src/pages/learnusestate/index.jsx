import React, { useState } from "react";

function learnUseState() {

  // Đây là cú pháp destructuring, gồm 2 biến (tên tùy chọn)
  // Biến đầu tiên là giá trị hiện tại của State
  // Biến thứ hai là một function dùng để cập nhật State
  // const [count, setCount] = useState(4)

  // useState có hai cách nhận giá trị mặc định
  //Cách trên là nhập giá trị cứng nhưng mỗi lần render sẽ gọi lại
  //Cách hai là nhận vào một function và giá sẽ chỉ được gọi 1 lần duy nhất
  // const [count, setCount] = useState(() => {
  //   console.log("Run useState")
  //   return 4
  // })

  const [count, setCount] = useState(4)
  const [theme, setTheme] = useState('blue')

  function decrementCount() {
    setCount(prevCount => prevCount - 1)
  }

  function incrementCount() {
    setCount(prevCount => prevCount + 1)
    setTheme('red')
  }

  return (
    <>
      <button type="button" onClick={decrementCount}>-</button>
      <span>{count}</span>
      <span>{theme}</span>
      <button type="button" onClick={incrementCount}>+</button>
    </>
  );
}

export default learnUseState;

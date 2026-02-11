import { useState } from "react"


export function DicreamentHooks() {
    const [count, setCount] = useState(1);
  return (
    <>
          <div className="max-w-[200px] shadow-xl mx-auto my-40">
              <h1 className="text-xl font-bold text-center">{count}</h1>
              <button className="bg-blue-500 text-white px-1 py-2 mx-14" onClick={() => setCount(count - 1 )}>Count IS:{ count}</button>
      </div>
    </>
  )
}



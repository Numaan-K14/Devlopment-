
import { useState } from "react"


export function DerivedStateUp() {
    const [input, setInput] = useState("");
    return (
      <>
        <div className="flex flex-col mx-auto text-center gap-4 my-40">
          <InputComponent abc={input} setInput={setInput} />
          <DisplayComponent pqr={input} />
        </div>
      </>
    );
}   

const InputComponent = ({abc,setInput}) => {
    return (
        <>
            <input type="text" placeholder="Enter Your name" value={abc} className="mx-auto" onChange={(e)=>setInput(e.target.value)}></input>
        </>
    )
}




const DisplayComponent = ({pqr}) => {
    return (
        <>
            <h1>The Value Is : {pqr}</h1>
        </>
    )
}
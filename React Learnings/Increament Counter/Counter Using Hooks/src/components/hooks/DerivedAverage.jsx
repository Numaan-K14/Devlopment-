import { useState } from "react"


export function DerivedAverage() {
    // eslint-disable-next-line no-unused-vars
    const [user, setUser] = useState([
      { name: "nfk", age: "22" },
      { name: "wxy", age: "23" },
      { name: "pqr", age: "24" },
      { name: "xyz", age: "25" },
      { name: "abc", age: "26" },
      { name: "abc", age: "27" },
    ]);
    const userCount = user.length;
    const AverageAge = user.reduce((accum,data)=>accum+Number(data.age),0)/userCount;
  return (
    <div className="my-20  mx-20">
          <h1>Users List</h1>
          <div>
              {user.map((data,index) => {
                  return (
                      <div key={index}>
                          {data.name} is {data.age} Years Old !
                      </div>
                    
                  )
              })}
          </div>
          <p>TotalCount : { userCount}</p>
          <p>TotalAverage : { AverageAge}</p>
    </div>
  )
}



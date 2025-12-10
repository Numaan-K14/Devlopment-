
const User = [
  { name: "nfk", age: "22" },
  { name: "wxy", age: "24" },
  { name: "pqr", age: "26" },
  { name: "xyz", age: "23" },
  { name: "abc", age: "22" },
];
export function DerivedState() {
  return (
    <>
          <div>Users List</div>
          <div>
              {User.map((data,index) => {
                  return (
                      <div key={index}>
                          {data.name} is {data.age} Years Old !
                      </div>
                  )
              })}
          </div>
    </>
  )
}



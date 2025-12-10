export const  Icons=({logo,name})=> {
  return (
    <>
   
        <div className="flex flex-col items-center">
            <img src={logo} alt="" />
            <p className="mt-2 font-semibold text-lg leading-7 text-[#000000]">
               {name}
            </p>
        </div>
   
    </>
  )
}


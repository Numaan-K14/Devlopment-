export const Practices = () => {
    const Students =[2]
    return (
      <>
        {/* <p>{Students.length === 0 && "No Students Found"}</p>
        <p>Number of Students :{Students.length}</p> */}
            <p>
               {Students.length > 0 ? `Length is :${Students.length}` : "Not Found" } 
            </p>
      </>
    );
}
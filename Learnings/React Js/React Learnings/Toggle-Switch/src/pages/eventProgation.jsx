

export function EventProgation() {
    const HandlebuttonGrandParent = () => {
  console.log("GrandParent Clicked");
};
const HandlebuttonParent = () => {
  console.log("Parent Clicked");
};
const HandlebuttonChild = () => {
  
  console.log("Child Clicked");
};
return (
  <>
    <section>
      <div className="bg-red-400 text-2xl" onClick={HandlebuttonGrandParent}>GrandParent</div>
      <div className="bg-green-400 text-2xl" onClick={HandlebuttonParent}>Parent</div>
      <button className="bg-blue-200" onClick={HandlebuttonChild}>Child</button>
    </section>
  </>
    );
}
    



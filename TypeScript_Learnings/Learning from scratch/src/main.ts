

function main(a: number, b: number): number;
function main(a: string, b: string): string;


function main(a: number | string, b: number | string): number | string {
    if (typeof a === "number" &&typeof b == "number") {
        return a + b;
    } else if (typeof a === "string" && typeof b == "string") {
        return a + "" + b;
    } else {
        throw new Error("Invalid Syntax :");
        
    }
}
console.log(main(1, 6));
console.log(main("Hello", "World"));
// console.log(main(1, "6"));





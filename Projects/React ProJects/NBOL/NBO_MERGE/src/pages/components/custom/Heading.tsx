import { RxExit } from "react-icons/rx";

type CustomHeadingProps = {
  heading: string;
  description: string;
  button?: string;
  LogoutHandle?: () => void;
};
export function CustomHeading({
  heading,
  description,
  button,
  LogoutHandle,
}: CustomHeadingProps) {
  return (
    <div>
      <header className="flex justify-between items-center p-8  ">
        <div>
          <h1 className="text-[#181D27] font-semibold text-3xl leading-9.5 ">
            {heading}
          </h1>
          <p className="font-normal text-base text-[#535862] leading-6 ">
            {description}
          </p>
        </div>
        {button && (
          <button
            onClick={LogoutHandle}
            className="font-semibold text-sm text-[#414651] bg-white border-2 border-[#D5D7DA] py-2.5 px-4 rounded-lg flex gap-2 items-center justify-center hover:bg-[#fafafade] transition cursor-pointer"
          >
            <RxExit />
            {button}
          </button>
        )}
      </header>
      <hr className="border-2 border-[#cfd2d4] w-full " />
    </div>
  );
}

// import { RxExit } from "react-icons/rx";
// type CustomHeadingProps = {
//   heading: string;
//   description: string;
//   button?: string;
// };
// export function CustomHeading({
//   heading,
//   description,
//   button,
// }: CustomHeadingProps) {
//   return (
//     <div>
//       <header className="flex justify-between items-center p-8">
//         <div>
//           <h1 className="text-[#181D27] font-semibold text-3xl">{heading}</h1>
//           <p className="text-base text-[#535862]">{description}</p>
//         </div>
//         {button && (
//           <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#414651] bg-white border-2 border-[#D5D7DA] rounded-lg hover:bg-[#fafafa] transition">
//             <RxExit />
//             {button}
//           </button>
//         )}
//       </header>
//       <hr className="border-2 border-[#cfd2d4]" />
//     </div>
//   );
// }

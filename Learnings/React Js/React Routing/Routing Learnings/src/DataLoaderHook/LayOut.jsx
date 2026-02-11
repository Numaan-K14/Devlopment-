import { FiLoader } from "react-icons/fi";
import { Navbar } from "./Navbar";
import { Outlet, useNavigation } from "react-router-dom";

export function LayOut() {
  // -----Loader------
  const navigation = useNavigation(); //this hook provide loader
  // console.log(navigation);

  if (navigation.state === "loading")
    return (
      <p className="min-h-screen flex flex-col justify-center items-center text-center text-6xl font-bold">
        <FiLoader className="animate-spin" />
      </p>
    );
  // -----Loader------

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

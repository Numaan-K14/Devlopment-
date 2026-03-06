"use client";
import { useRouter } from "next/navigation";

function Landing() {
  const router = useRouter();
  function LogoutHandle() {
    localStorage.removeItem("token");
    router.replace("login");
  }

  return (
    <section
      className="min-h-screen bg-gradient-to-r from-[#2563EB] to-[#4F46E5]
"
    >
      <div>Landing</div>
      <button onClick={LogoutHandle}>Logout</button>
    </section>
  );
}

export default Landing;

export function Footer() {
  return (
    <>
      <footer class="bg-[#0A0D12] text-white pt-16 pb-8 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-12 leading-[2.375rem] text-[#FFFFFF]">
            Let’s get started on something great
          </h2>

          <div className="flex flex-col sm:flex-col md:flex-row justify-center items-center gap-3 mb-16 w-full sm:w-auto md:auto">
            <button className="w-full md:w-auto bg-[#1570EF] text-white text-base font-semibold px-5 py-3 rounded-md hover:bg-[#93C5FD] transition">
              Get started
            </button>

            <button className="w-full md:w-auto bg-white text-[#344054] text-base font-semibold px-5 py-3 rounded-md hover:bg-[#E0F2FE] border border-[#D5D7DA]">
              Chat to us
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}

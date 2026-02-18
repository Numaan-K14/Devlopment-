import Image from "next/image";


function page() {
  return (
    <section>
      <div className="max-w-6xl mx-auto p-10 flex flex-colitems-center gap-8">
        <Image
          src="/Country.jpg" //
          alt="Sample" // accessibility + SEO
          height={400} // image height (required)
          width={600} // image width (required)
          quality={80} // image quality (1–100)
          priority={false} // preload (true = eager load)
          loading="lazy" // lazy load (default)
          placeholder="empty" // placeholder type
          sizes="(max-width: 768px) 100vw, 600px" // responsive sizing
          className="w-full h-auto rounded-xl shadow-lg" // Tailwind styles
        />

        <div className="w-full">
          <h2 className="text-3xl font-bold mb-4">Simple Image Section</h2>
          <p className="text-gray-600 mb-6">
            This is a basic image section in Next.js using Tailwind CSS.
            Responsive and clean for understanding layout.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

export default page;

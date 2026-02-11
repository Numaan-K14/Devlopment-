export default function BrainLoader() {
  return (
    <div className='fixed h-full w-[calc(100%-30px)] flex flex-col items-center justify-center  backdrop-blur-sm z-[1000]'>
      <div className='text-6xl animate-brain'>🧠</div>

      <div className='flex gap-2 mt-4'>
        <span className='w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-[0ms]'></span>
        <span className='w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-[200ms]'></span>
        <span className='w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-[400ms]'></span>
      </div>

      <p className='mt-3 text-white text-sm'>Thinking...</p>
    </div>
  );
}

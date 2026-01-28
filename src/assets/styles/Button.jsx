
export default function Button({method, text}) {
  return (
    <div className="flex flex-col justify-center items-center md:h-full md:w-full">
        <button onClick={method}  className='p-3 text-xl md:text-2xl mt-3 bg-blue-500 text-white rounded-md w-[100%] md:text-[16px] text-[13px] md:w-[100%] hover:bg-blue-900'>
            {text}
        </button>
    </div>
    
  );
}


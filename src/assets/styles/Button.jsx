
export default function Button({method, text}) {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
        <button onClick={method}  className='p-3 bg-blue-500 text-white rounded-md  w-[50%] hover:bg-blue-600'>
            {text}
        </button>
    </div>
    
  );
}


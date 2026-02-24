export default function Header( {title, descricao}) {
    return(
      <div>
        <header
            className="
                w-full
                max-w-7xl
                mx-auto
                mt-24
                md:mt-5
                rounded-xl
                flex-col flex justify-center items-center
                h-[18vh]
                bg-[#0E4194]
                dark:bg-[#001941]
                bg-cover bg-center
              "
          
          >
            <h1 className="sm:text-3xl text-2xl text-white font-bold text-center w-full">
              {title}
            </h1>
            <h2 className="text-lg sm:text-xl text-[#90adff] font-bold text-center w-full">
              {descricao}
            </h2>
      </header>
      </div>
        
    )
}
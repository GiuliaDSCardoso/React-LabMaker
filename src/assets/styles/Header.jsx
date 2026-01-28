export default function Header( props) {
    return(
        <header className="flex items-center bg-gradient-to-r from-[#1976d2] to-blue-800 h-[20vh] px-6">
            <h1 className="text-2xl font-bold w-[95%] text-white text-center mx-auto">
            {props.children}
          </h1>
        </header>);
}
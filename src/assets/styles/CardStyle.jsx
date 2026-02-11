import { ArrowRightIcon } from 'lucide-react';
import PropTypes from 'prop-types';

const colorMap = {
  yellow: "bg-sky-400",
  red: "bg-indigo-400",
  blue: "bg-blue-400",
  green: "bg-cyan-400",
};

function CardStyle({ title, description, icon, href, color }) {
  return (
    <a
      href={href}
      className="flex flex-col items-start md:w-80 md:h-64 w-64 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className='flex h-24 items-center gap-3 mb-3'>
        {/* Ícone */}
        <div
          className={`flex text-white items-center justify-center p-2 ${colorMap[color]} rounded-md`}
        >
          {icon}
        </div>

        {/* Título */}
        <h2 className="md:text-2xl text-[18px]  text-black/70 font-bold leading-tight">
          {title}
        </h2>
      </div>

      {/* CONTEÚDO CENTRAL */}
      <div className='flex flex-col justify-center items-center text-start flex-1'>
        <p className="text-black/50 h-[60px] md:text-xl text-lg leading-relaxed line-clamp-2">
          {description}
        </p>

        <button className='mt-4 bg-[#3995eb] flex items-center gap-2 font-bold hover:bg-[#2579c7] py-2 active:bg-[#2579c7] text-white px-10 md:px-20 rounded-xl'>
          Solicitar <ArrowRightIcon />
        </button>
      </div>
    </a>
  );
}

CardStyle.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default CardStyle;

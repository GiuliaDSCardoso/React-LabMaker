

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
      className="flex flex-col w-64 h-40 p-6 rounded-2xl shadow-lg  hover:shadow-xl transition-shadow duration-300"
    >
      <div className='flex  items-center gap-3 mb-3'>
        {/* Ícone */}
        <div className={`flex  text-white items-center justify-center p-2 ${colorMap[color]} rounded-md `}>
          {icon}
        </div>
        {/* Título */}
        <h2 className="text-[18px] text-black/70 font-bold leading-tight ">
          {title}
        </h2>
      </div>
      

      {/* Descrição */}
      <p className="text-black/50 text-md leading-relaxed line-clamp-2">
        {description}
      </p>
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

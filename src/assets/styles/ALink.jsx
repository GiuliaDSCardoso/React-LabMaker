import PropTypes from 'prop-types';

export default function ALink(props) {
    return (
        <a className="text-[#1976d2] text-md md:text-lg md:px-0 w-[100%] text-center px-3 h-8 pt-1 md:hover:bg-blue-50 hover:bg-blue-100 no-underline font-bold hover:text-blue-700" href={props.href}>
            {props.children}
        </a>
    );
}

ALink.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
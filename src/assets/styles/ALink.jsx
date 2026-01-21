import PropTypes from 'prop-types';

export default function ALink(props) {
    return (
        <a className="text-[#1976d2] no-underline font-bold hover:text-blue-700" href={props.href}>
            {props.children}
        </a>
    );
}

ALink.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
import PropTypes from 'prop-types';
import "../../index.css";

export default function Body(props) {
    return(
        <div className=" flex flex-col itemns-center mx-0 w-screen mb-30 h-screen ">
            {props.children}
        </div>);
}

Body.propTypes = {
    children: PropTypes.node
};

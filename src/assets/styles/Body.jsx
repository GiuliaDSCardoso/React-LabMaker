import PropTypes from 'prop-types';
import "../../index.css";

export default function Body(props) {
    return(
        <div className=" mx-0 w-screen h-screen ">
            {props.children}
        </div>);
}

Body.propTypes = {
    children: PropTypes.node
};

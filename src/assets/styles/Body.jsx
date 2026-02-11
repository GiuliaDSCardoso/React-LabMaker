import PropTypes from 'prop-types';
import "../../index.css";

export default function Body(props) {
    return(
        <div className="flex flex-col items-center min-h-screen mx-0 mb-30">
            {/* Conteúdo da página */}
            <div className="flex-grow w-full">
                {props.children}
            </div>

            {/* Footer */}
            <footer className="w-full bg-blue-100 text-center py-4 text-gray-800 text-sm">
                Made by Giulia Cardoso
            </footer>
        </div>
    );
}

Body.propTypes = {
    children: PropTypes.node
};

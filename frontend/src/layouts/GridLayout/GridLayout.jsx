import './GridLayout.css';


function GridLayout ({ children }) {
    return (
        <ul className='grid'>
            {children}
        </ul>
    );
};

export default GridLayout;
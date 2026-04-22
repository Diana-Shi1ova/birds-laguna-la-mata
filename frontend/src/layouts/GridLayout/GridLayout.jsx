import './GridLayout.css';


function GridLayout ({ children }) {
    return (
        // <ul className='catalog-list'>
        <ul className='grid'>
            {children}
        </ul>
    );
};

export default GridLayout;
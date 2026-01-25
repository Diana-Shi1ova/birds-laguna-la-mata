import './ListLayout.css';


function ListLayout ({ children }) {
    return (
        <ul className='catalog-list'>
            {children}
        </ul>
    );
};

export default ListLayout;
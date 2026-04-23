import './BirdCarousel.css';
import BirdCard from '../BirdCard/BirdCard';


function BirdCarousel ({ birds }) {

    return (
        <ul className='bird-carousel'>
            {birds.map((bird, index) => 
                <li key={index}>
                    <BirdCard></BirdCard>
                </li>
            )}
        </ul>
    );
};

export default BirdCarousel;
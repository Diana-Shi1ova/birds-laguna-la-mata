import './BirdCarousel.css';
import BirdCard from '../BirdCard/BirdCard';
import Button from '../Button/Button';

import { useRef, useState, useEffect } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

function BirdCarousel({ birds }) {
    const [index, setIndex] = useState(0);
    const listRef = useRef(null);
    const [itemWidth, setItemWidth] = useState(0);
    const [margin, setMargin] = useState(0);
    const [maxIndex, setMaxIndex] = useState(0);

    const viewportRef = useRef(null);

    const scrollNext = () => {
        if (!viewportRef.current) return;

        viewportRef.current.scrollBy({
            left: 300, // можно подогнать
            behavior: "smooth"
        });
    };

    const scrollPrev = () => {
        if (!viewportRef.current) return;

        viewportRef.current.scrollBy({
            left: -300,
            behavior: "smooth"
        });
    };

    /*const visibleItems = 3; // сколько карточек видно
    const maxIndex = Math.max(0, birds?.length - visibleItems);

    const next = () => {
        setIndex(prev => Math.min(prev + 1, maxIndex));
    };

    const prev = () => {
        setIndex(prev => Math.max(prev - 1, 0));
    };*/
    

    

    useEffect(() => {
        const update = () => {
            if (!listRef.current) return;

            const totalWidth = viewportRef.current.offsetWidth;
            const firstItem = listRef.current.querySelector("li");
            if (firstItem) {
                const width = firstItem.offsetWidth;
                const style = window.getComputedStyle(firstItem);
                // const marginRight = parseInt(style.marginRight) || 0;
                const styles = window.getComputedStyle(listRef.current);
                const gap = parseInt(styles.gap);
                console.log(gap)
                setMargin(gap);
                setItemWidth(width + gap);

                setMaxIndex(birds.length-totalWidth/(width + gap));
            }
        };

        update();
        window.addEventListener("resize", update);

        return () => window.removeEventListener("resize", update);
    }, [birds]);

    const next = () => setIndex(prev => Math.min(prev + 1, maxIndex));
    const prev = () => setIndex(prev => Math.max(prev - 1, 0));

    return (
        <div className='carousel-container'>
            <div className="carousel-viewport" ref={viewportRef}>
                <ul
                    ref={listRef}
                    className='bird-carousel'
                    style={{
                        transform: index<(maxIndex-1) ? `translateX(-${index * itemWidth}px)` : `translateX(-${index * itemWidth - margin}px)`,
                        transition: "transform 0.5s ease"
                    }}
                >
                    {birds?.map((bird, i) => (
                        <li key={i} className="carousel-item">
                            <BirdCard data={bird} />
                        </li>
                    ))}
                </ul>
            </div>

            <Button classAdditional='left' func={prev}>
                <FaCaretLeft />
            </Button>

            <Button classAdditional='right' func={next}>
                <FaCaretRight />
            </Button>
        </div>
    );
}

export default BirdCarousel;

/*import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";


function BirdCarousel ({ birds }) {

    return (
        <div className='carousel-container'>
            <Button classAdditional='left'><FaCaretLeft/></Button>
            <ul className='bird-carousel'>
                {birds?.map((bird, index) => 
                    <li key={index}>
                        <BirdCard data={bird}></BirdCard>
                    </li>
                )}
            </ul>
            <Button classAdditional='right'><FaCaretRight/></Button>
        </div>
        
    );
};

export default BirdCarousel;*/
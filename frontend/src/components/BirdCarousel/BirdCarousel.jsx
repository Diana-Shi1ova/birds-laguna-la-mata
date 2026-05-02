import './BirdCarousel.css';
import BirdCard from '../BirdCard/BirdCard';
import Button from '../Button/Button';

import { useRef, useState, useEffect } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';


function BirdCarousel({ birds }) {
    const { t } = useTranslation();
    const [index, setIndex] = useState(0);
    const listRef = useRef(null);
    const [itemWidth, setItemWidth] = useState(0);
    const [margin, setMargin] = useState(0);
    const [maxIndex, setMaxIndex] = useState(0);

    const viewportRef = useRef(null);

    const scrollNext = () => {
        if (!viewportRef.current) return;

        viewportRef.current.scrollBy({
            left: 300,
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

    useEffect(() => {
        const update = () => {
            if (!listRef.current) return;

            const totalWidth = viewportRef.current.offsetWidth;
            const firstItem = listRef.current.querySelector("li");
            if (firstItem) {
                const width = firstItem.offsetWidth;
                const style = window.getComputedStyle(firstItem);
                const styles = window.getComputedStyle(listRef.current);
                const gap = parseInt(styles.gap);
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

            <Button classAdditional='left' func={prev} tooltip={t('carousel.button.previous')} disabled={(index==0) ? true : false}>
                <FaCaretLeft />
            </Button>

            <Button classAdditional='right' func={next} tooltip={t('carousel.button.next')} disabled={(index===maxIndex) ? true : false}>
                <FaCaretRight />
            </Button>
        </div>
    );
}

export default BirdCarousel;
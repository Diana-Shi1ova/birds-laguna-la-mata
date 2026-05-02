import './ButtonInfo.css';
import Button from '../Button/Button';
import { FcInfo } from "react-icons/fc";

import { FaQuestion } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";

import { useState, useEffect, useRef } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift
} from '@floating-ui/react';



function ButtonInfo({message='default message', question=false, title=''}) {  // type: 'info' | 'question'
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Cerrar al clicar fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setOpen(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { refs, floatingStyles } = useFloating({
        placement: 'bottom',
        middleware: [
        offset(8),
        flip(),
        shift({ padding: 8 })
        ]
    });

    return(
        <div className='info-container' ref={ref}>
            <Button classAdditional='but-info' type='icon' func={() => setOpen(prev => !prev)} ref={refs.setReference} tooltip={title}>
                {question ? <FaQuestion /> : <FaInfo />}
            </Button>

            {open && (
            <div ref={refs.setFloating} className='message' style={{...floatingStyles}}>
                {message}
            </div>)}
        </div>
    );
}

export default ButtonInfo;
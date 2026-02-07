import './Pagination.css';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { useState } from 'react';

import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";


function Pagination({total = 1, current = 1, onCurrentChange }) {
    const previousPage = () => {
        if (current>1) onCurrentChange(current-1);
    }

    const nextPage = () => {
        if (current<total) onCurrentChange(current+1);
    }

    const onPageChange = (event) => {
        onCurrentChange(event.target.value);
    }

    const onEnter = (event) => {
        event.target.blur();
        if(event.target.value>total) onCurrentChange(total);
    }

    return(
        <div className='pagination-container'>
            <Button func={previousPage}><FaAngleLeft /></Button>
            <Input type={"number"} value={current} change={onPageChange} enter={onEnter}></Input>
            <p className='total'>/<span>{total}</span></p>
            <Button func={nextPage}><FaAngleRight /></Button>
        </div>
    );
}

export default Pagination;
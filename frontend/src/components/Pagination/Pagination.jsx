import './Pagination.css';
import Button from '../Button/Button';
import Input from '../Input/Input';
import InputNumber from '../InputNumber/InputNumber';
import { useState } from 'react';

import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';


function Pagination({total = 1, current = 1, onCurrentChange }) {
    const { t } = useTranslation();
    const previousPage = () => {
        if (current>1) onCurrentChange(current-1);
    }

    const nextPage = () => {
        if (current<total) onCurrentChange(current+1);
    }

    const onPageChange = (event) => {
        // onCurrentChange(Number(event.target.value));
        onCurrentChange(Number(event.target.value));
    }

    const onEnter = (event) => {
        event.target.blur();
        // const value = Number(event.target.value);
        // if(value>total) onCurrentChange(total);
        // if(value<1) onCurrentChange(1);
    }

    return(
        <div className='pagination-container'>
            <Button
                func={previousPage}
                tooltip={t('pagination.button.previous')}
                disabled={(current-1 < 1) ? true : false}
            >
                <FaAngleLeft />
            </Button>
            <InputNumber name="page" value={current} change={onPageChange} enter={onEnter} blur={onEnter} min={1} max={total} step={1}></InputNumber>
            <p className='total'>/<span>{total}</span></p>
            <Button
                func={nextPage}
                tooltip={t('pagination.button.next')}
                disabled={(current+1 > total) ? true : false}
            >
                <FaAngleRight />
            </Button>
        </div>
    );
}

export default Pagination;
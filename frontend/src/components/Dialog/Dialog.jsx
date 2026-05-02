import './Dialog.css';
import { useEffect, useState, useRef } from "react";
import Button from '../Button/Button';
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";


function Dialog({buttonTitle, buttonClass='', dialogClass='', buttonTooltip='', children}) {
    const { t } = useTranslation();
    const dialogRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);

    const openDialog = () => {
        dialogRef.current?.showModal();
    };

    /*const closeDialog = () => {
        dialogRef.current?.close();
    };*/
    const closeDialog = () => {
        setIsClosing(true);

        setTimeout(() => {
            dialogRef.current?.close();
            setIsClosing(false);
        }, 200); // longitud de animación
    };

    return (
        <>
            <Button func={openDialog} classAdditional={buttonClass} tooltip={buttonTooltip}>{buttonTitle}</Button>
            {/* <button onClick={openDialog}>{buttonTitle}</button> */}

            <dialog ref={dialogRef} className={dialogClass+` dialog ${isClosing ? "closing" : "opening"}`}>
                <Button classAdditional='close-button' type='icon' func={closeDialog} tooltip={t('map.options.button.close')}><FaTimes /></Button>
                <div className="dialog-content">
                    {children}
                </div>
            </dialog>
        </>
    );
}

export default Dialog;
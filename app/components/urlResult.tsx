import { useState, useRef, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

import * as globalStyles from '../global.module.css';
import styles from './urlResult.module.css';

interface UrlResultProps {
    index: number;
    urlTitle: string;
    deleteUrlResultHandler: (index: number) => void;
    onClick: (e: any, index: number) => void;
    onChange: (e: any) => void;
    value: string;
};

export default function UrlResult({
    index,
    urlTitle,
    deleteUrlResultHandler,
    onClick,
    onChange,
    value,

}: UrlResultProps) {

    const [displayTextInput, setDisplayInput] = useState<boolean>(false);
    const newRef = useRef<HTMLLIElement | null>(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    });

    const handleOutsideClick = (e: any) => {
        if (newRef.current && !newRef.current.contains(e.target)) {
            setDisplayInput(false);
        };
    };

    function submitHandler(e : any){
        onClick(e, index);
        setDisplayInput(false);
    }

    return (
        <li ref={newRef} key={index} className={globalStyles.pillShape}>
            <div className={styles.urlResultTitle} >
                {urlTitle}
            </div>
            <div className={styles.iconsContainer}>
                <button onClick={() => setDisplayInput(prev => !prev)}>
                    <FaRegEdit />
                </button>
                <button onClick={() => deleteUrlResultHandler(index)}>
                    <MdDeleteOutline />
                </button>
            </div>
            {displayTextInput ? 
                <form className={styles.editUrlContainer}>
                    <input onChange={(e) => onChange(e)} value={value} type="url" className={styles.editUrlInput} />
                    <button type="submit" onClick={(e)=>submitHandler(e)}>Save</button>
                </form>
                : null
            }
        </li>
    );
};
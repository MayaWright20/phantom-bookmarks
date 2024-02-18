'use client';
import React, { useState, useEffect, useMemo } from "react";
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import Image from 'next/image';
import * as styles from "./global.module.css";
import UrlResult from "./components/urlResult";
import icon from "../public/icon.gif";

export default function Home() {

  const [url, setUrl] = useState<string>('');
  const [urlResults, setUrlResults] = useState<string[]>([]);
  const [editUrl, setEditUrl] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showThankyou, setShowThankyou] = useState<boolean>(false);
  const { width, height } = useWindowSize();
  const itemsPerPage = 20;

  useEffect(() => {
    const storedUrlResults = localStorage.getItem('urlResults');
    if (storedUrlResults) {
      setUrlResults(JSON.parse(storedUrlResults));
    };
  }, []);

  const onChangeUrlInputHandler = (e: any) => {
    const url = e.target.value;
    setUrl(url);
  };

  const onClickSubmitHandler = async (e : any) => {
    e.preventDefault();

    const urlPattern = /^(https?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{0,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    if (!urlPattern.test(url.trim())) {
      alert('Please enter a valid URL.');
      return;
    };

    try {
      const response = await fetch(url, {
        mode: 'no-cors'
      });

      if (response) {
        setUrlResults(prev => {
          const updatedResults = [url, ...prev];
          localStorage.setItem('urlResults', JSON.stringify(updatedResults));
          return updatedResults;
        });

        setIsExploding(true);
        setShowThankyou(true);
        setTimeout(() => {
          setIsExploding(false);
          setShowThankyou(false);
        }, 5000)
        setUrl('');
      }
    } catch (error) {
      alert('Website does not exist');
    }
  };

  const deleteUrlResultHandler = (index: number) => {
    setUrlResults(prev => {
      const filteredResults = prev.filter((_, i) => i !== index);
      localStorage.setItem('urlResults', JSON.stringify(filteredResults));
      return filteredResults;
    });
  };

  const onChangeUrlEditHandler = (e: any) => {
    const url = e.target.value;
    setEditUrl(url);
    setValue(url)
  };

  const onClickUrlSubmitHandler = async (e: any, index: number) => {
    e.preventDefault();
    const urlPattern = /^(https?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{0,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    if (!urlPattern.test(editUrl.trim())) {
      alert('Please enter a valid URL.');
      return;
    };

    try {
      const response = await fetch(editUrl, {
        mode: 'no-cors'
      });

      if (response) {
        let newUrlResults = [...urlResults];
        newUrlResults[index] = editUrl;

        setUrlResults(newUrlResults);
        localStorage.setItem('urlResults', JSON.stringify(newUrlResults));
        setEditUrl("");
        setValue("");
      }
    } catch (error) {
      alert('Website does not exist');
    }
  };

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return urlResults.slice(startIndex, endIndex);
  }, [urlResults, currentPage]);

  const onPageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="flex flex-col">
      {isExploding && <Confetti
        numberOfPieces={isExploding ? 300 : 0}
        width={width}
        height={height * 2}
        run={isExploding}
        opacity={isExploding ? 1 : 0}
        recycle={true}
        colors={[
          '#FDF0FCff',
          '#C1C1C7ff',
          '#EBEFFEff',
          '#FFECEAff',
          '#DCF3FEff',
          '#F5EEFFff',
          '#FFEDCBff',
          '#E4F3EDff',
          '#FDEFDFff',
        ]}
      />}
      <button onClick={() => onPageChange(1)}>
        <Image src={icon} alt='first page' height={50} width={50} className='ml-5 mt-5' />
      </button>
      <button onClick={() => onPageChange(1)}>
      <div className={styles.header}>
        {!showThankyou ?
        <span>
          <p>B</p>
        <p>O</p>
        <p>O</p>
        <p>K</p>
        <p>M</p>
        <p>A</p>
        <p>R</p>
        <p>K</p>
        <p>S</p>
        </span>
        
        : 
        <span>
          <p>T</p>
          <p>H</p>
          <p>A</p>
          <p>N</p>
          <p>K</p>
          <p></p>
          <p>Y</p>
          <p>O</p>
          <p>U</p>
        </span>
        
}
        
      </div>
      </button>
      <div className="self-center" style={{ width: '80%' }}>
        <form className={`${styles.pillShape} ${styles.searchBar}`}>
          <input onChange={onChangeUrlInputHandler} value={url} type="url" className={styles.input}/>
          <button type="submit" onClick={onClickSubmitHandler}>Add</button>
        </form>
        <ul>
        {paginatedResults.map((item, index) => (
          <UrlResult
            key={index}
            index={(currentPage - 1) * itemsPerPage + index}
            urlTitle={item}
            deleteUrlResultHandler={() => deleteUrlResultHandler((currentPage - 1) * itemsPerPage + index)}
            onClick={(e) => onClickUrlSubmitHandler(e, (currentPage - 1) * itemsPerPage + index)}
            onChange={(e) => onChangeUrlEditHandler(e)}
            value={value}
          />
        ))}
      </ul>
      <div className={styles.paginationContainer}>
        <button className={styles.previousPageBtn} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          <h1>{"<"}</h1>
        </button>
        <span className={styles.currentPageBtn}>{currentPage}</span>
        <button className={styles.nextPageBtn} onClick={() => onPageChange(currentPage + 1)} disabled={paginatedResults.length < itemsPerPage}>
          <h1>{">"}</h1>
        </button>
      </div>
      </div>
    </main>
  );
};

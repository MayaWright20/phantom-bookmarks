'use client';

import Image from 'next/image';
import { useState, useEffect } from "react";
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti'
import ReactPaginate from 'react-paginate';

import * as styles from "./global.module.css";
import UrlResult from "./components/urlResult";
import icon from "../public/icon.gif";

export default function Home() {

  const [url, setUrl] = useState<string>('');
  const [urlResults, setUrlResults] = useState<string[]>([]);
  const [editUrl, setEditUrl] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [firstPage, setFirstPage] = useState<boolean>(false);
  const { width, height } = useWindowSize();

 

  useEffect(() => {
    const storedUrlResults = localStorage.getItem('urlResults');
    if (storedUrlResults) {
      setUrlResults(JSON.parse(storedUrlResults));
    };
  }, []);

  const onChangeUrlInputHandler = (e) => {
    const url = e.target.value;
    setUrl(url);
  };

  const onClickSubmitHandler = async (e) => {
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
        setTimeout(() => {
          setIsExploding(false);
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

  function onChangeUrlEditHandler(e) {
    const url = e.target.value;
    setEditUrl(url);
    setValue(url)
  };

  async function onClickUrlSubmitHandler(e, index: number) {
    //DO NOT CHANGE THIS E.PREVENT FUNCTION
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

  function Items({ currentItems }) {
    return (
      <ul style={{ flexDirection: 'column' }}>
        {currentItems &&
          currentItems.map((item, index) => (
            <UrlResult
              key={index}
              index={index}
              urlTitle={item}
              deleteUrlResultHandler={() => deleteUrlResultHandler(index)}
              onClick={(e) => onClickUrlSubmitHandler(e, index)}
              onChange={(e) => onChangeUrlEditHandler(e)}
              value={value}
            />
          ))}
      </ul>
    );
  };
  
  function PaginatedItems({ itemsPerPage, firstPage }) {
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = urlResults.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(urlResults.length / itemsPerPage);

    function handlePageClick(event){
      const newOffset = (event.selected * itemsPerPage) % urlResults.length;
      if(firstPage){
        setItemOffset(0)
      }else{
        setItemOffset(newOffset);
      }
    };

    return (
      <>
        <Items currentItems={currentItems} />
        <ul className={styles.paginationContainer}>
          <ReactPaginate
            breakLabel=""
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            marginPagesDisplayed={0}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            containerClassName="paginationContainer"
            activeLinkClassName="activePaginationLink"
          />
        </ul>
      </>
    )
  };

  function firstPageHandler(){
    setFirstPage(true);
    setTimeout(()=>{
      setFirstPage(false);
    },500);
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
      <button onClick={firstPageHandler}>
        <Image src={icon} alt='first page' height={50} width={50} className='ml-5 mt-5' />
      </button>
      <div className="self-center" style={{ width: '80%' }}>
        <form className={`${styles.pillShape} ${styles.searchBar}`}>
          <input onChange={onChangeUrlInputHandler} value={url} type="url" style={{ width: '65vw' }} />
          <button type="submit" onClick={onClickSubmitHandler}>Add</button>
        </form>
        <PaginatedItems itemsPerPage={20} firstPage={firstPage}/>
      </div>
    </main>
  );
};



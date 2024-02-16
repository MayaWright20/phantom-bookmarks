'use client';
import { useState, useEffect } from "react";
import UrlResult from "./components/urlResult";

import * as styles from "./global.module.css";

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const [urlResults, setUrlResults] = useState<string[]>([]);
  const [editUrl, setEditUrl] = useState<string>('');
  const [value, setValue] = useState<string>('');

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

  return (
    // <main className="flex min-h-screen flex-col items-center p-24">
    //   <div className="z-10 max-w-5xl w-full items-center font-mono text-sm">
      <main className="flex flex-col items-center">
      <div className="items-center" style={{width: '80%'}}>
      <div className={`${styles.pillShape} ${styles.searchBar}`}>
        <form>
          <input onChange={onChangeUrlInputHandler} value={url} type="url" />
          <button type="submit" onClick={onClickSubmitHandler}>Add</button>
        </form>
        </div>
        <div>
          <ul style={{ flexDirection: 'column'}}>
            {urlResults.map((item, index) => (
              <UrlResult
                key={index}
                index={index}
                urlTitle={item}
                deleteUrlResultHandler={() => deleteUrlResultHandler(index)}
                //DO NOT CHANGE THIS ONCLICK FUNCTION
                onClick={(e) => onClickUrlSubmitHandler(e, index)}
                onChange={(e) => onChangeUrlEditHandler(e)}
                value={value}
              />
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

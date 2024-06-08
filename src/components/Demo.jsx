import React, { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick, trash } from "../assets"; // Importing images and icons from the assets folder
import { useLazyGetSummaryQuery } from "../services/article"; // Importing query function from article service

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]); // State to store all articles from localStorage
  const [copied, setCopied] = useState(""); // State to mark whether URL has been copied

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery(); // Using RTK query lazily

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage); // Setting allArticles state from data in localStorage
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle); // If article already exists in history, display that article

    const { data } = await getSummary({ articleUrl: article.url }); // Fetching summary of article using RTK query
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle); // Saving newly queried article to state
      setAllArticles(updatedAllArticles); // Adding new article to list of all articles
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles)); // Saving all articles to localStorage
    }
  };

  // copy the url and toggle the icon for user feedback
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl); // Copying URL to clipboard
    setTimeout(() => setCopied(false), 3000); // After 3 seconds, revert copied to false
  };

  const handleDelete = (deletedUrl) => {
    const updatedArticles = allArticles.filter((item) => item.url !== deletedUrl); // Deleting article from list of all articles
    setAllArticles(updatedArticles); // Updating list of all articles after deletion
    localStorage.setItem("articles", JSON.stringify(updatedArticles)); // Updating localStorage after deleting article
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e); // Handle form submit when enter key is pressed
    }
  };

  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* Search form */}
      <div className='flex flex-col w-full gap-2'>
        <form
          className='relative flex justify-center items-center'
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt='link-icon'
            className='absolute left-0 my-2 ml-3 w-5'
          />

          <input
            type='url'
            placeholder='Paste the article link'
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className='url_input peer' 
          />
          <button
            type='submit'
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 '
          >
            <p>↵</p>
          </button>
        </form>

        {/* Browse History */}
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)} // Display article when clicked from list of all articles
              className='link_card'
            >
              <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy} // Change copy icon to tick icon when URL is copied
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
              {/* Trash icon for deleting history item */}
              <img
                src={trash}
                alt='trash-icon'
                className='w-5 cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation(); // Avoid triggering parent onClick
                  handleDelete(item.url); // Delete item from history
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Display Result */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-black text-center'>
            Well, that wasn't supposed to happen...
            <br />
            <span className='font-satoshi font-normal text-gray-700'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;

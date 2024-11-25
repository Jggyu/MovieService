// src/components/popular/Popular.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faList } from '@fortawesome/free-solid-svg-icons';
import TableView from './TableView';
import InfiniteView from './InfiniteView';
import Header from '../layout/Header';

const Popular = () => {
  const [viewMode, setViewMode] = useState('table');
  const [bodyStyle, setBodyStyle] = useState({});
  const apiKey = localStorage.getItem('TMDb-Key') || '';

  useEffect(() => {
    if (viewMode === 'table') {
      setBodyStyle({ overflow: 'hidden' });
      document.body.style.overflow = 'hidden';
    } else {
      setBodyStyle({ overflow: 'auto' });
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [viewMode]);

  return (
    <div className="bg-gray-900 min-h-screen" style={bodyStyle}>
      <Header />
      <div className="px-4 md:px-8 pt-24 pb-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Popular Movies</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all
                       ${viewMode === 'table' 
                         ? 'bg-blue-600 text-white' 
                         : 'bg-gray-800 text-gray-400'}`}
            >
              <FontAwesomeIcon icon={faTableCells} />
              <span className="hidden md:inline">Table View</span>
            </button>
            <button
              onClick={() => setViewMode('infinite')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all
                       ${viewMode === 'infinite' 
                         ? 'bg-blue-600 text-white' 
                         : 'bg-gray-800 text-gray-400'}`}
            >
              <FontAwesomeIcon icon={faList} />
              <span className="hidden md:inline">Infinite View</span>
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={viewMode === 'table' ? 'h-[calc(100vh-200px)] overflow-hidden' : ''}
        >
          {viewMode === 'table' ? (
            <TableView apiKey={apiKey} />
          ) : (
            <InfiniteView apiKey={apiKey} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Popular;
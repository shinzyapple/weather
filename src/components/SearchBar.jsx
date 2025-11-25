import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setQuery('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="glass"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                marginBottom: '2rem',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '50px', // より丸く
            }}
        >
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city..."
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '1rem',
                    flex: 1,
                    outline: 'none',
                    padding: '0.5rem',
                    fontFamily: 'inherit',
                }}
            />
            <button
                type="submit"
                style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    opacity: 0.8,
                    transition: 'opacity 0.2s',
                    backdropFilter: 'none', // 親のglass効果を使うため
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
            >
                <Search size={20} />
            </button>
        </form>
    );
};

export default SearchBar;

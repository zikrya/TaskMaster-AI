import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const statusStyles = {
    'To Do': 'bg-gray-100 text-gray-500 rounded-lg',
    'In Progress': 'bg-blue-100 text-blue-500 rounded-lg',
    'Done': 'bg-green-100 text-green-400 rounded-lg',
};

const CustomDropdown = ({ options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(selected);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSelectedOption(selected);
    }, [selected]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        onChange(option);
        setIsOpen(false);
    };

    const getStatusStyles = (status) => {
        return statusStyles[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="relative inline-block w-full" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-auto py-2 px-4 flex justify-between items-center bg-white"
            >
                <div className={`px-2 py-1 flex items-center rounded ${getStatusStyles(selectedOption.label || selectedOption)}`}>
                    {selectedOption.label || selectedOption}
                    <FaChevronDown size={10} className="ml-1" />
                </div>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-6/12 bg-white border border-gray-300 rounded shadow-lg">
                    {options.map((option) => (
                        <div
                            key={option.value || option}
                            onClick={() => handleOptionClick(option)}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center`}
                        >
                            <div className={`px-2 py-1 flex items-center rounded ${getStatusStyles(option.label || option)}`}>
                                {option.label || option}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;


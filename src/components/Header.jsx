import { Link, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import EAdmitLogo from '../assets/EAdmitLogo.svg';
import { useState } from 'react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="navbar px-[1.5%] xl:px-[9%] py-[.7%] bg-white bg-opacity-80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="navbar-start">
                <Link to="/">
                    <img 
                        className='w-auto h-[60px] md:h-[80px] object-contain object-center me-3' 
                        src={EAdmitLogo} 
                        alt="logo" 
                    />
                </Link>
            </div>
 
            <div className="navbar-end flex items-center max-md:pr-2 max-sm:pr-1">
                <div className="hidden lg:flex items-center">
                    <ul className="menu menu-horizontal px-1 text-lg font-semibold">
                        <li><Link to="/" className="text-[#5D9749] hover:text-[#AECF95]">Home</Link></li>
                        <li><Link to="/about" className="text-[#5D9749] hover:text-[#AECF95]">About</Link></li>
                    </ul>
                    <div className="dropdown relative">
                        <div 
                            tabIndex={0} 
                            role="button" 
                            className="btn btn-md rounded-sm text-lg font-semibold bg-[#ffd700] hover:bg-yellow-400 text-white border-none outline-none max-sm:btn-sm max-md:btn-md max-lg:btn-lg">
                            Apply now!
                        </div>
                        <ul 
                            tabIndex={0} 
                            className="dropdown-content absolute left-0 mt-3 py-2 shadow bg-[#f6f9ff] rounded-sm w-52 divide-y max-h-60 overflow-auto">
                            <li><Link to='/freshmen' className='rounded-sm w-full mb-3 text-base font-medium whitespace-nowrap'>New Student</Link></li>
                            <li><Link to='/transferee' className='rounded-sm text-base font-medium whitespace-nowrap'>Transferee</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="lg:hidden">
                    <button onClick={toggleMenu}>
                        <GiHamburgerMenu size={30} />
                    </button>
                </div>
            </div>
            
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-md">
                    <ul className="menu menu-vertical px-1 text-lg font-semibold">
                        <li><Link to="/" onClick={toggleMenu} className="text-[#5D9749] hover:text-[#AECF95]">Home</Link></li>
                        <li><Link to="/about" onClick={toggleMenu} className="text-[#5D9749] hover:text-[#AECF95]">About</Link></li>
                        <li>
                            <div className="dropdown relative">
                                <div 
                                    tabIndex={0} 
                                    role="button" 
                                    className="btn btn-md rounded-sm text-lg font-semibold bg-[#ffd700] hover:bg-yellow-400 text-white border-none outline-none max-sm:btn-sm max-md:btn-md max-lg:btn-lg">
                                    Apply now!
                                </div>
                                <ul 
                                    tabIndex={0} 
                                    className="dropdown-content absolute left-0 mt-3 py-2 shadow bg-[#f6f9ff] rounded-sm w-52 divide-y max-h-60 overflow-auto z-50">
                                    <li><Link to='/freshmen' onClick={toggleMenu} className='rounded-sm w-full mb-3 text-base font-medium whitespace-nowrap'>Freshmen</Link></li>
                                    <li><Link to='/transferee' onClick={toggleMenu} className='rounded-sm text-base font-medium whitespace-nowrap'>Transferee</Link></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;

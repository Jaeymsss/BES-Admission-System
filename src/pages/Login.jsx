import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ButongLogo from '../assets/ButongLogo.svg';
import { useAuth } from '../context/AuthContext';
// import logo from '../assets/logo.png'

const Login = () => {
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const { email, password } = inputData;

    const handleChange = (e) => {
        setInputData({...inputData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await axios.post('/api/login', {
                email,
                password
            });
    
            const data = res.data;
            login(data.token, data.user);
            Swal.fire({
                title: `${data.message}`,
                icon: "success",
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            navigate('/schedule');
        } catch(e) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${e.response.data}`,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
        }
    }

  return (
    <div className='bg-gradient-to-r from-green-400 to-green-600 w-full min-h-screen relative flex items-center justify-center'>
        <div className='flex flex-wrap justify-center w-[1200px] h-[650px] shadow-lg shadow-b rounded-2xl divide-x-2 divide-[#7d7f8a] max-md:mx-10 max-md:divide-x-0 max-sm:mx-2'>
            <div className='w-1/2 flex items-center justify-center max-md:hidden' style={{ backgroundColor: '#3FA34D', borderRadius: '15px 0 0 15px' }}>
                <img className='object-cover object-center w-3/4' src={ButongLogo} />
            </div>
            <div className='w-1/2 flex items-center flex-col justify-center max-md:w-full' style={{ backgroundColor: '#CEE5C6', borderRadius: '0 15px 15px 0' }}>
                {/* <img className='w-[100px] h-[100px]' src={logo} alt="logo" /> */}
                <h1 className='text-3xl mt-6 font-bold text-center text-black flex items-center justify-center select-none'>E -Admit</h1>
                <h1 className='text-3xl mt-2 font-bold text-center text-black flex items-center justify-center select-none'>Admission System</h1>
                <p className='text-sm italic mt-2 mb-5 text-center text-black select-none'>Please Sign in to Continue</p>
                <form onSubmit={handleSubmit} className='mx-auto w-full px-24 max-xl:px-20 max-lg:px-16 max-sm:px-2'>
                    <div className='mt-6'>
                        <label className='label-text text-black font-medium select-none'>Email Address *</label>
                        <input className='bg-white p-4 pr-4 text-xs w-full rounded-md border border-solid border-[#000000] outline-none my-[10px] shadow-sm' type="email" placeholder='Enter your email address' name='email' value={email} onChange={handleChange} />
                    </div>

                    <div className='mt-3'>
                        <label className='label-text text-black font-medium select-none'>Password *</label>
                        <div className='relative'>
                            <input className='bg-white p-4 pr-4 text-xs w-full rounded-md border border-solid border-[#000000] outline-none my-[10px] shadow-sm' type={showPassword ? 'text' : 'password'} placeholder='Enter your password' name='password' value={password} onChange={handleChange} autoComplete='off'/>
                            <button type='button' onClick={togglePasswordVisibility} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-black'>
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    {/* <div>
                        <Link to='/' className='text-sm text-black border-none float-end capitalize max-sm:text-xs'>Forgot password?</Link>
                    </div> */}
                    <button className='btn w-full bg-[#8DC71D] hover:bg-[#76A917] duration-300 text-sm text-white rounded-md border-none shadow capitalize mt-5' disabled={isSubmitting}> {isSubmitting ? 'Submitting...' : 'Login'}</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login
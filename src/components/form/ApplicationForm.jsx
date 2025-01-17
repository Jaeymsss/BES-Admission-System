import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { FiArrowLeft, FiSend } from "react-icons/fi";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../Header';

const ApplicationForm = () => {
    const form = useRef();
    const clearInputFile = useRef(null);
    const clearInputFile2 = useRef(null);
    const clearInputFile3 = useRef(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('/api/application/schedule');
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const availableSchedule = response.data.filter(schedule => {
                const scheduleDate = new Date(schedule.date);
                scheduleDate.setHours(0, 0, 0, 0);
                return scheduleDate >= currentDate && schedule.maxStudent > schedule.studentId.length;
            });
            
            availableSchedule.sort((a, b) => new Date(a.date) - new Date(b.date));
            setSchedules(availableSchedule);
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${e.response.data}`,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#22C55E',
            });
        }
    };

    const handleScheduleSelect = (schedule, e) => {
        e.preventDefault();
        setSelectedSchedule(schedule);
        setSelectedButton(schedule._id);
    };


    const [inputData, setInputData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        extensionName: '',
        age: '',
        sex: '',
        civilStatus: '',
        religion: '',
        dob: '',
        placeOfBirth: '',
        address: '',
        citizenship: '',
        zipCode:'',
        lrn: '',
        email: '',
        phone: '',
        parentName: '',
        occupation: '',
        parentPhone: '',
        school: '',
        schoolAddress: '',
        course: ''
    });

    const [inputFile, setInputFile] = useState({
        fileOne: null,
        fileTwo: null,
        fileThree: null
    });

    const { firstName, middleName, lastName, extensionName, age, sex, civilStatus, religion, dob, placeOfBirth, address, citizenship, zipCode, lrn, email, phone, parentName, occupation, parentPhone, school, schoolAddress, course } = inputData;

    const { fileOne, fileTwo, fileThree } = inputFile;

    const clearInputData = () => {
        setInputData({
            firstName: '',
            middleName: '',
            lastName: '',
            extensionName: '',
            age: '',
            sex: '',
            civilStatus: '',
            religion: '',
            dob: '',
            placeOfBirth: '',
            address: '',
            citizenship: '',
            zipCode:'',
            lrn: '',
            email: '',
            phone: '',
            parentName: '',
            occupation: '',
            parentPhone: '',
            school: '',
            schoolAddress: '',
            course: ''
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if ((name === 'lastName' || name === 'firstName' || name === 'middleName') && /[^a-zA-Z\s]/.test(value)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please enter only letters for names.',
                confirmButtonColor: '#22C55E',
            });
            return;
        }
        if (name === 'age' && (isNaN(value) || value <= 0)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Age',
                text: 'Please enter a valid positive number for age.',
                confirmButtonColor: '#22C55E',
            });
            return;
        }
        if ((name === 'phone' || name === 'parentPhone') && value < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone number cannot be negative.',
                confirmButtonColor: '#22C55E',
            });
            return;
        }
        if ((name === 'phone' || name === 'parentPhone') && value.length > 10) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone number should be exactly 10 digits.',
                confirmButtonColor: '#22C55E',
            });
            return;
        }
        if (name === 'zipCode' && (isNaN(value) || value.length > 5)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Zip Code',
                text: 'Please enter a valid numeric zip code with a maximum of 5 digits.',
                confirmButtonColor: '#22C55E',
            });
            return;
        }
        setInputData({...inputData, [name]: value});
        if(e.target.name === 'zipCode' && isNaN(e.target.value)){
            Swal.fire({
                icon: 'error',
                title: 'Invalid Zip Code',
                text: 'Please enter a valid numeric zip code.',
                confirmButtonColor: '#22C55E',
            });
        } else if((e.target.name === 'phone' || e.target.name === 'parentPhone') && (e.target.value.length > 10 || e.target.value < 0)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone number should be exactly 10 digits and not negative.',
                confirmButtonColor: '#22C55E',
            });
        }
        if(e.target.name === 'lrn' && isNaN(e.target.value)){
            Swal.fire({
                icon: 'error',
                title: 'Invalid Year',
                text: 'Please enter a valid numeric Year.',
                confirmButtonColor: '#22C55E',
            });
        } else if (e.target.name === 'lrn' && e.target.value.length > 4) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Year',
                text: 'Year has a limit of 4 digits.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedSize = 2 * 1024 * 1024;

        if(selectedFile.type !== "application/pdf") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please upload PDF files only.',
                confirmButtonColor: '#22C55E',
            });
            e.target.value = null;
        } else if(selectedFile.size > allowedSize) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please upload a PDF file that is 2MB below.',
                confirmButtonColor: '#22C55E',
            });
            e.target.value = null;
        } else {
            setInputFile({...inputFile, [e.target.name]: selectedFile});
        } 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (lastName.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Last Name',
                text: 'Please Enter your Last Name.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (firstName.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty First Name',
                text: 'Please Enter your First Name.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (middleName.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Middle Name',
                text: 'Please Enter your Last Name.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (age.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Age',
                text: 'Please Enter your Age.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (sex.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Sex',
                text: 'Please Enter your Sex.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (civilStatus.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Civil Status',
                text: 'Please Enter your Civil Status.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (religion.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Religion',
                text: 'Please Enter your Religion.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (dob.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Date of Birth',
                text: 'Please Enter your Date of Birth.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (placeOfBirth.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Place of Birth',
                text: 'Please Enter your Place of Birth.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (address.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Address',
                text: 'Please Enter your Address.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (citizenship.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Citizenship',
                text: 'Please Enter your Citizenship.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (lrn.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Year',
                text: 'Please Enter your Year.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (email.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Email Address',
                text: 'Please Enter your Email Address.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (phone.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Phone Number',
                text: 'Please Enter your Phone Number.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (zipCode.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty zip code',
                text: 'Please Enter your zip code.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (parentName.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Parent Name',
                text: 'Please Enter your Parent Name.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (occupation.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Occupation',
                text: 'Please Enter your Occupation.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (parentPhone.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Parent Phone Number',
                text: 'Please Enter your Parent Phone Number.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (school.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty School Name',
                text: 'Please Enter your School Name.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (schoolAddress.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty School Address',
                text: 'Please Enter your School Address.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (course.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Strand',
                text: 'Please Enter your Strand.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (isNaN(lrn)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Year',
                text: 'Please enter a valid numeric Year.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        } else if (lrn.length !== 4) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Year',
                text: 'Year must have exactly 4 digits.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (isNaN(zipCode)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Zip Code',
                text: 'Please enter a valid numeric zip code.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        } 

        if (phone.length !== 10 || phone < 0 || parentPhone.length !== 10 || parentPhone < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone number should be exactly 10 digits and not negative.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        if(fileOne) {
            formData.append('files', fileOne);
        }
        if(fileTwo) { 
            formData.append('files', fileTwo);
        }
        if(fileThree) {
            formData.append('files', fileThree);
        }

        formData.append('firstName', firstName);
        formData.append('middleName', middleName);
        formData.append('lastName', lastName);
        formData.append('extensionName', extensionName);
        formData.append('age', age);
        formData.append('sex', sex);
        formData.append('civilStatus', civilStatus);
        formData.append('religion', religion);
        formData.append('dob', dob);
        formData.append('placeOfBirth', placeOfBirth);
        formData.append('address', address);
        formData.append('citizenship', citizenship);
        formData.append('lrn', lrn);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('zipCode', zipCode);
        formData.append('parentName', parentName);
        formData.append('occupation', occupation);
        formData.append('parentPhone', parentPhone);
        formData.append('school', school);
        formData.append('schoolAddress', schoolAddress);
        formData.append('course', course);
        formData.append('studentStatus', 'Freshmen');

        try {
            const response = await axios.post('/api/application', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const studentId = response.data.id;

            if (selectedSchedule) {
                await axios.put(`/api/application/select/${selectedSchedule._id}`, { studentId: studentId });
            }

            let timerInterval;
            Swal.fire({
                title: 'Application is Submitting',
                html: 'Please wait for a moment...',
                timer: 1500,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector('b');
                    timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                },
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    Swal.fire({
                        title: `${response.data.message}`,
                        text: `Please verify your email address. We sent an email on this address: ${response.data.email}`,
                        icon: 'success',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        confirmButtonColor: '#22C55E',
                    });
                }
            });
    
            clearInputData();
            setSelectedButton(null);
            if (clearInputFile.current) {
                clearInputFile.current.value = '';
            }
            if (clearInputFile2.current) {
                clearInputFile2.current.value = '';
            }
            if (clearInputFile3.current) {
                clearInputFile3.current.value = '';
            }
            setIsSubmitting(false);
            fetchSchedules();
        } catch(e){
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
    <div className='w-full min-h-screen bg-gradient-to-r from-green-400 to-green-600'>
        <Header />
    
            <div className="p-5 w-full shadow-lg">
                <form ref={form} onSubmit={handleSubmit} className='bg-white max-w-5xl p-12 shadow rounded-lg mt-16 mx-auto max-sm:px-5'>
                    <h2 className='text-3xl uppercase font-bold mb-10 text-black max-sm:text-xl'>APPLICATION FORM FOR NEW STUDENTS</h2>    
                    <hr className='border-black mb-10'/>
                    <div className='flex items-center justify-center gap-[30px] mb-8 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Last Name*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Type here' name='lastName' value={lastName} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>First Name*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Type here' name='firstName' value={firstName} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Middle Name</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Type here' name='middleName' value={middleName} onChange={handleChange}/>
                        </div>

                        <div className="w-1/4 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none capitalize'>Suffix</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='opt.' name='extensionName' value={extensionName} onChange={handleChange}/>
                        </div>
                    </div>


                    <div className='flex items-center justify-center gap-[30px] mb-8 max-sm:flex-col'>
                        <div className="w-1/4 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Age*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="number" placeholder='...' name='age' value={age} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Gender*</span>
                            <select name="sex" onChange={handleChange} className='w-full p-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' required>
                                <option selected disabled>Choose a gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Civil Status*</span>
                            <select name="civilStatus" onChange={handleChange} className='w-full p-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' required>
                                <option selected disabled>Civil Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Separated">Separated</option>
                            </select>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none capitalize'>Religion*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Type here' name='religion' value={religion} onChange={handleChange}/>
                        </div>
                    </div>


                    <div className='flex items-center justify-center gap-[30px] mb-8 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none capitalize'>Date of Birth*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] capitalize' type="date" placeholder='Date of Birth' name='dob' value={dob} onChange={handleChange} />
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Place of Birth*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Type here' name='placeOfBirth' value={placeOfBirth} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Permanent Address*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Type here' name='address' value={address} onChange={handleChange} required/>
                        </div>
                        <div className="w-1/3 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Citizenship*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Type here' name='citizenship' value={citizenship} onChange={handleChange} required/>
                        </div>
                    </div>


                    <div className='flex items-center justify-center gap-[30px] mb-12 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Year*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Ex: 2025' name='lrn' value={lrn} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Email Address*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="email" placeholder='Type here' name='email' value={email} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/3 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Phone Number*<span className='text-gray-700'> +63</span></span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="number" placeholder='Phone (9xxxxxxxxx)' name='phone' value={phone} onChange={handleChange} maxLength={10} required/>
                        </div>

                        <div className="w-1/4 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Zip Code*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Type here' name='zipCode' value={zipCode} onChange={handleChange} required/>
                        </div>
                        
                    </div>


                    <div className='flex items-center justify-center gap-[30px] mb-12 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Parent/Guardian Name*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Type here' name='parentName' value={parentName} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Occupation</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Type here' name='occupation' value={occupation} onChange={handleChange}/>
                        </div>

                        <div className="w-1/3 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Phone Number*<span className='text-gray-700'> +63</span></span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="number" placeholder='Phone (9xxxxxxxxx)' name='parentPhone' value={parentPhone} onChange={handleChange} maxLength={10} required/>
                        </div>
                    </div>



                    <div className="flex items-start justify-center mb-12 max-sm:flex-col">
                        <div className="w-1/2 max-sm:w-full">
                            <h2 className='text-2xl font-bold text-black break-all text-center max-sm:text-lg'>FOR ELEMENTARY SCHOOL APPLICANT OR TRANSFEREE OF THE CURRENT</h2>
                            <h2 className='text-2xl font-bold text-black break-all text-center max-sm:text-lg'>ACADEMIC YEAR</h2>
                            <p className='mt-6 text-base font-normal text-center max-sm:text-xs'>Name of Preschool or Kindergarten Attended (Do not abbreviate).</p>
                            <span className='label-text text-black font-bold select-none mt-3'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Do not leave it blank.' name='school' value={school} onChange={handleChange}/>


                            <p className='mt-6 text-base font-normal text-center max-sm:text-xs'>Address of Preschool or Kindergarten Attended</p>
                            <span className='label-text text-black font-bold select-none mt-3'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Do not leave it blank.' name='schoolAddress' value={schoolAddress} onChange={handleChange}/>


                            <p className='mt-6 text-base font-normal text-center max-sm:text-xs'>Grade Level</p>
                            <span className='label-text text-black font-bold select-none mt-3'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB]' type="text" placeholder='Ex: Grade One' name='course' value={course} onChange={handleChange}/>
                        </div>
                    </div>


                    <h2 className='text-xl font-bold text-black break-all max-sm:text-lg'>Requirements for Elementary</h2>
                    <p className='mt-3 label-text font-normal max-sm:text-xs'>Note: Include your full name in the filename of the requirements;</p>
                    <p className='label-text font-normal max-sm:text-xs'>Incomplete entry of personal information, tampered documents, erasures, and incomplete documents will not be processed.</p>

                    <div className='flex items-start justify-center gap-[30px] mb-20 mt-8 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <p className='text-lg font-medium text-black max-sm:text-base'>Upload a Copy of PSA Birth Certificate.</p>
                            <p className='label-text text-justify mt-2 max-sm:text-xs'>Note: Documents should be readable and completely scanned</p>                   
                            <input ref={clearInputFile} className='file-input file-input-bordered file-input-sm w-full max-w-xs rounded-md mt-2' type="file" name='fileOne' onChange={handleFileChange} accept='.pdf' required/>


                            <p className='label-text text-justify mt-10 max-sm:text-xs'>2 pieces Identical Photograph, Passport size with name tag, white background, and taken within the last six months.</p>
                            <input ref={clearInputFile2} className='file-input file-input-bordered file-input-sm w-full max-w-xs rounded-md mt-2' type="file" name='fileTwo' onChange={handleFileChange} accept='.pdf' required/>


                            <p className='label-text text-justify mt-10 max-sm:text-xs'>For the Elementary Students, grades for the first, second and third grading periods, duly signed by the school principal.<br/>(Note: Documents schould be readable and completely scanned)</p>
                            <input ref={clearInputFile3} className='file-input file-input-bordered file-input-sm w-full max-w-xs rounded-md mt-2' type="file" name='fileThree' onChange={handleFileChange} accept='.pdf' required/>
                        </div>
                    </div>

                    
                    <div className="mt-6 mb-20">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Available Schedules</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {schedules.map(schedule => (
                                <div key={schedule._id} className="border border-gray-200 rounded p-4">
                                    <div className='select-none'>Date: {format(new Date(schedule.date),'MMM dd, yyyy')}</div>
                                    <div className='select-none'>Time: {format(new Date(schedule.time),'hh:mm a')}</div>
                                    <div className='flex items-center justify-between'>
                                        <button onClick={(e) => handleScheduleSelect(schedule, e)} disabled={selectedButton === schedule._id} className={`mt-2 bg-[#3B82F6] hover:opacity-80 text-white text-sm rounded-md p-1.5 ${selectedButton === schedule._id ? 'cursor-not-allowed opacity-50' : ''}`}>
                                            {selectedButton === schedule._id ? 'Selected' : 'Select'}
                                        </button>
                                        <span className='mt-2 select-none text-xs md:text-sm badge badge-success text-white badge-sm md:badge-md'>Left: {schedule.maxStudent - schedule.studentId.length}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    

                    <div className="flex justify-between">
                        <Link to='/' className='btn bg-blue-500 hover:bg-blue-400 text-sm text-white rounded-md border-none shadow capitalize max-sm:btn-sm max-sm:text-xs'><FiArrowLeft size={20}/>back</Link>
                        <button className='btn bg-green-500 hover:bg-green-400 text-sm text-white rounded-md border-none shadow capitalize max-sm:btn-sm max-sm:text-xs' disabled={isSubmitting || schedules.length === 0}>{isSubmitting ? 'Submitting...' : 'Submit'}<FiSend size={20}/></button>
                    </div>
                </form>
            </div>

    </div>
  )
}

export default ApplicationForm

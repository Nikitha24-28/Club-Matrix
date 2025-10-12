import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Phone, MapPin, Calendar, UserCircle } from 'lucide-react';
import './Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        }

        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        console.log('Validation errors:', newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
        
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        console.log('Form validation passed, proceeding with signup');
        setIsLoading(true);
        
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    address: formData.address
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create account');
            }

            console.log('Signup successful:', data);
            
            // Navigate to login page after successful signup
            navigate('/login', { 
                state: { 
                    message: 'Account created successfully! Please log in to continue.',
                    email: formData.email 
                }
            });
        } catch (error) {
            console.error('Signup error:', error);
            setErrors({ submit: error.message || 'Failed to create account. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="signup-container">
            <div className="signup-header">
                <button className="back-button" onClick={handleBackToHome}>
                    <ArrowLeft className="back-icon" />
                    Back to Home
                </button>
                <div className="signup-logo">
                    <h1>CLUB MATRIX</h1>
                    <p>Create Your Account</p>
                </div>
            </div>

            <div className="signup-content">
                <div className="signup-form-container">
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h2>Join CLUB MATRIX</h2>
                            <p>Fill in your details to get started</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="fullName">
                                <User className="input-icon" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={errors.fullName ? 'error' : ''}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <Mail className="input-icon" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? 'error' : ''}
                                placeholder="Enter your email address"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">
                                    <Lock className="input-icon" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={errors.password ? 'error' : ''}
                                    placeholder="Create a password"
                                />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    <Lock className="input-icon" />
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={errors.confirmPassword ? 'error' : ''}
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone">
                                    <Phone className="input-icon" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={errors.phone ? 'error' : ''}
                                    placeholder="Enter your phone number"
                                />
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="dateOfBirth">
                                    <Calendar className="input-icon" />
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className={errors.dateOfBirth ? 'error' : ''}
                                />
                                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">
                                <UserCircle className="input-icon" />
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className={errors.gender ? 'error' : ''}
                            >
                                <option value="">Select your gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <span className="error-message">{errors.gender}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">
                                <MapPin className="input-icon" />
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={errors.address ? 'error' : ''}
                                placeholder="Enter your full address"
                                rows="3"
                            />
                            {errors.address && <span className="error-message">{errors.address}</span>}
                        </div>

                        {errors.submit && (
                            <div className="error-message submit-error">{errors.submit}</div>
                        )}

                        <button 
                            type="submit" 
                            className="signup-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <div className="signup-footer">
                            <p>
                                Already have an account? 
                                <button 
                                    type="button" 
                                    className="login-link"
                                    onClick={() => navigate('/login')}
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="signup-info">
                    <div className="info-content">
                        <h3>Why Join CLUB MATRIX?</h3>
                        <ul className="info-list">
                            <li>✓ Manage multiple clubs effortlessly</li>
                            <li>✓ Track attendance and engagement</li>
                            <li>✓ Organize events and meetings</li>
                            <li>✓ Connect with like-minded individuals</li>
                            <li>✓ Access powerful analytics</li>
                            <li>✓ Enterprise-grade security</li>
                        </ul>
                        <div className="info-stats">
                            <div className="stat">
                                <strong>10,000+</strong>
                                <span>Active Clubs</span>
                            </div>
                            <div className="stat">
                                <strong>98%</strong>
                                <span>Satisfaction Rate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
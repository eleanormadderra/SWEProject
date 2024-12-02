/**
 * LoadingPage component renders a full-screen loading spinner.
 * 
 * This component displays a centered spinner with a rotating animation,
 * indicating that a loading process is ongoing.
 * 
 * @returns {JSX.Element} The rendered loading spinner component.
 */
import React from 'react';

const LoadingPage: React.FC = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f0f0',
            }}
        >
            <div
                style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #000',
                    borderTop: '5px solid #F00',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }}
            ></div>
            <style>
                {`
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default LoadingPage;

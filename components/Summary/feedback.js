import React, { useState, useEffect } from 'react';
import './feedback.css';
import userImage from '../../assets/user_circle.png'; // Import the image
import logoImage from '../../assets/shg.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

export default function Feedback() {
  const [strengths, setstrengths] = useState('');
  const [improvements, setimprovements] = useState('');
  const [Id,setId] = useState('');

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isReviewer = role !== 'reviewer';
  
  const handlenavigate= () => {
   
    
    console.log('to reccomendtaion');
    
    // Navigate to the recommendation page
    navigate('/recommendation');
  };
 


  useEffect(() => {
    // Retrieve the token, ID, and role from local storage
    const token = localStorage.getItem('token');
    const ID = localStorage.getItem('ID');
    const role = localStorage.getItem('role');

    // Set the default Authorization header for Axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setId(ID);
  }, []);

  const handleStrengthInputChange1 = (e) => {
    setstrengths(e.target.value);
  };

  const handleStrengthInputChange2 = (e) => {
    setimprovements(e.target.value);
  };

  const handleSave = () => {
    // Make an HTTP POST request to send the feedback data to the backend
   
     
    
    axios
      .post('https://appbackend-rala.onrender.com/feedbackRouter/submit-feedback', {
        appraiseeId: "64fd8e3b9a14a681cba43ad3",
        strengths: strengths,
        improvements: improvements,
      })
      
      .then((response) => {
        console.log(improvements)
        console.log('Feedback Saved');
        // Navigate to the recommendation page after successful submission
        navigate('/recommendation');
      })
      .catch((error) => {
        console.error('Error saving feedback:', error);
      });
  };
  
  const handlechange = () => {
  

    console.log('Feedback Saved');

    // Navigate to the recommendation page
    navigate('/recommendation');
  };

  return (
    <div className="main-body">
      <div className="sidebar">
        {/* Sidebar content */}
        <img src={logoImage} alt="Example" className='logoimage' />
        <div className="sidebar-item" style={{ marginTop: 50 }}>
          <i className="material-icons"></i>
          <span>Dashboard</span>
        </div>
        <div className="sidebar-item">
          <i className="material-icons"></i>
          <span>Self Appraisal</span>
        </div>
        <div className="sidebar-item">
          <i className="material-icons"></i>
          <span>Team</span>
        </div>
      </div>

      <div className="right">
        <div className="top">
          {/* Display the image */}
          <h1 className='name' style={{ marginRight: 600, marginTop: 30 }}>Feedback to Appraisee</h1>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: '100px' }}>
            <img src={userImage} alt="Example" className='profileimage' />

            {/* Display the name and id */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="name">{Id}</h3>
              <p className="name" style={{ fontWeight: 300, fontSize: 16, marginTop: -15 }}>
                {role}
              </p>
            </div>
          </div>
        </div>
        <div className="break"></div>
        <div className="bottom">
          <div className="profile-page">
            {/* Insert the table here */}
            <table>
              <thead>
                <tr>
                  <th className='sbox2'>Areas of strength of the appraisee that need nurturing</th>
                  <th className='sbox2'>
                    <input
                      type="text"
                      disabled={isReviewer}
                      className='sbox2'
                      value={strengths}
                      onChange={handleStrengthInputChange1}
                      placeholder="Assessment of the reviewing authority to be recorded here (Row 1)"
                    />
                  </th>
                </tr>
                <tr>
                  <th className='sbox2'>Areas where the appraisee needs to take action for improvements, and suggested steps</th>
                  <th className='sbox2'>
                    <input
                      type="text"
                      disabled={isReviewer}
                      className='sbox2'
                      value={improvements}
                      onChange={handleStrengthInputChange2}
                      placeholder="Assessment of the reviewing authority to be recorded here (Row 2)"
                    />
                  </th>
                </tr>
              </thead>
              {/* Add table content here */}
            </table>

            <div>
              {/* Your other content */}
            </div>

            <div className="profile-section">
              <button
                type="submit"
                onClick={handleSave}
                disabled={isReviewer} 
                style={{ width: '10vw' }}// Disable the button for reviewers
              >
                Submit
              </button>
            
          <button type="button" onClick={handlechange} className="next-button" style={{ width: '10vw' }}>
            Next
          </button>

            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

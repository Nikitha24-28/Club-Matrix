import React from 'react'
import axios from "axios";
import './CreateClub.css';

const CreateClub = () => {

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userEmail = localStorage.getItem("email");
  
    const formData = {
      clubName: e.target.ClubName.value,
      clubDescription: e.target.ClubDescription.value,
      clubCategory: e.target.ClubCategory.value,
      clubHead: e.target.ClubHead.value,
      clubEmail: e.target.ClubEmail.value,
      clubSocialMedia: e.target.ClubSocialMedia.value,
      clubLogo: e.target.clubLogo.files[0]?.name || "", // backend expects string
      userEmail
    };
  
    try {
      const res = await axios.post("http://localhost:5000/create", formData);
      alert(res.data.message); // success or custom backend message
    } catch (err) {
      alert(err.response?.data?.message || "Error creating club");
    }
  };

  return (
    <div className='create-club-content'>
      <h1> Create a Club </h1>
      <form onSubmit={handleSubmit}>
          <label>Club Name:</label>
          <input type="text" name="ClubName" placeholder="Enter Club Name" required />
          <br/>
          <label>Club Description:</label>
          <textarea name="ClubDescription" placeholder="Enter Club Description" required />
          <br/>
          <label>Club Category:</label>
          <select name="ClubCategory" id="clubCategory" required>
              <option value="">-- Select Category --</option>
              <option value="Academic">Academic</option>
              <option value="Technical">Technical & Innovation</option>
              <option value="Arts">Arts & Culture</option>
              <option value="Literary">Literary & Language</option>
              <option value="Business">Entrepreneurship & Business</option>
              <option value="Social">Social Impact & Volunteering</option>
              <option value="Sports">Sports & Fitness</option>
              <option value="Spiritual">Spiritual & Mindfulness</option>
              <option value="Hobby">Hobby & Special Interest</option>
              <option value="Media">Media & Communication</option>
              <option value="Others">Others</option>
          </select>
          <br/>
          <label>Club Head:</label>
          <textarea name="ClubHead" placeholder="Enter Club Head Name" required />
          <br/>
          <label>Club Email:</label>
          <input type="email" name="ClubEmail" placeholder="Enter Club Email" required />
          <br/>
          <label>Social Media Link:</label>
          <input type="text" name="ClubSocialMedia" placeholder="Enter Any Club Social Media Link"/>
          <br/>
          <label>Upload Club Logo:</label>
          <input type="file" name="clubLogo" accept="image/*" />
          <br/>
          <button type="submit" className="submit-btn">Create Club</button>
      </form>
    </div>
  )
}

export default CreateClub
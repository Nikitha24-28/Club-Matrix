import React from 'react'
import './CreateClub.css';

const CreateClub = () => {
  return (
    <div className='create-club-content'>
      <h1> Create a Club </h1>
      <form>
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
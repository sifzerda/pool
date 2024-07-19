// SettingsPage.js
import React from 'react';
import greenTablePic from '../../public/images/greenTable.jpg';
import blueTablePic from '../../public/images/tableBlue.jpg';
import redTablePic from '../../public/images/tableRed.jpg';
import yellowTablePic  from '../../public/images/tableYellow.jpg';
import pinkTablePic  from '../../public/images/tablePink.jpg';
import monoTablePic  from '../../public/images/tableMono.jpg';
import chalkTablePic  from '../../public/images/tableChalk.jpg';
import chalkTripTablePic from '../../public/images/tableChalkTrip.jpg';

const Settings = ({ backgroundImage, onBackgroundChange, onClose }) => {
  const handleBackgroundChange = (event) => {
    onBackgroundChange(event.target.value);
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <div className="background-selection">
        <h3>Select Pool Table Background:</h3>
        <label>
          <input
            type="radio"
            value={greenTablePic}
            checked={backgroundImage === greenTablePic}
            onChange={handleBackgroundChange}
          />
          Green Table
        </label>
        <label>
          <input
            type="radio"
            value={blueTablePic}
            checked={backgroundImage === blueTablePic}
            onChange={handleBackgroundChange}
          />
          Blue Table
        </label>
        <label>
          <input
            type="radio"
            value={redTablePic}
            checked={backgroundImage === redTablePic}
            onChange={handleBackgroundChange}
          />
          Red Table
        </label>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Settings;
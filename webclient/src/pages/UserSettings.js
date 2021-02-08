import React, { useContext, useState } from 'react';
import { Context } from '../context/context';
import axios from 'axios';

const UserSettings = () => {
    const [state, dispatch] = useContext(Context);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
    function submitPWChangeRequest() {
      if (oldPassword && newPassword && confirmNewPassword && newPassword === confirmNewPassword) {
        const PWRequest = {oldPW: oldPassword, newPW: newPassword};
        axios.post('/user/change_pw', PWRequest)
          .then(res => {
            console.log(`Placeholder for successful PW change request`);
          })
          .catch(err => {
            console.log(`Placeholder for PW change request error`);
          })
      } else {
        alert(`Please make sure to enter your old PW, as well as a new password that matches itself in the confirmation field.`);
      }
    }
  
    return (
      <div style={{display: 'flex', width: '100%', alignItems: 'center', marginTop: '1rem', flexDirection: 'column'}}>
        <h1>Welcome to USER PAGE.</h1>
        <h3>This is where I'll tell you all about yourself! And maybe change your settings.</h3>
        <h3>Come to think of it, "Settings" and "User" might end up being separate concerns. That's fine!</h3>
        <h2>You can Change Password here:</h2>
        <input style={{padding: '18px', margin: '16px'}} type='password' placeholder={'Your old password'} value={oldPassword} onChange={e => setOldPassword(e.target.value)}></input>
        <input style={{padding: '18px', margin: '16px'}} type='password' placeholder={'Your new password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}></input>
        <input style={{padding: '18px', margin: '16px'}} type='password' placeholder={'Confirm your new password'} value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}></input>
        <button style={{padding: '18px', margin: '16px'}} onClick={submitPWChangeRequest}>Change Password</button>
      </div>
    )
}

export default UserSettings;
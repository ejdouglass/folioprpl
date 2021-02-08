import React, { useContext, useEffect } from 'react';
import { Context, actions } from '../context/context';
import { events } from '../events/events';

const Home = () => {
    const [state, dispatch] = useContext(Context);
  
    // HERE: We should only be here if we're logged in, so let's slap a useEffect down.
    /*
      About the useEffect:
      -- This is ideally where the user will land when they log in each new day. (Maybe have a lastInteractDate so the Header can check as the user does stuff?)
      -- ?
    */
    useEffect(() => {
      // Initial load effects
    }, []);
  
    return (
      <div style={{display: 'flex', flexDirection: 'column', width: '100%', marginTop: '1rem', alignItems: 'center', padding: '1rem'}}>
        <h1>Welcome home, {state.playgroundname}!</h1>
        <h2>We may now do things. Well, not yet. Soon, though!</h2>
        <h3 style={{textAlign: 'center'}}>The idea for this page is to present an interactive "core" of the PrPl experience. This is also where the first tutorial will 'load.'</h3>
        {state.encounters?.tabula_rasa === 0 && 
        <>
          <h1>What a TREAT! Your adventure is beginning right now!</h1>
          <button style={{padding: '0.8rem'}} onClick={() => dispatch({type: actions.MOUNT_CUTSCENE, payload: events.introduction})}>BEGIN</button>
        </>
        }
      </div>
    )
}

export default Home;
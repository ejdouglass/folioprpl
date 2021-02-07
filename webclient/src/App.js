import React, { useContext, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import axios from 'axios';
import './App.css';
import { save, load, dateToString, updateDB } from './functions/globalfxns';
import { Store, Context, actions } from './context/context';
import { Button } from './components/AuthComponent'
import { events } from './events/events';

const App = () => {
  return (
    <Store>
      <Router>
        <div id='app-container'>
          <Cutscene />
          <Header />
          <div id='app-body'>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <PrivateRoute exact path='/user' component={UserPage} />
            <PrivateRoute exact path='/home' component={Home} />
            <PrivateRoute exact path='/body' component={Body} />
            <PrivateRoute exact path='/create_activity' component={CreateActivity} />
            <PrivateRoute exact path='/people' component={People} />
          </div>
        </div>
      </Router>
    </Store>
  )
}


const Cutscene = () => {
  const [state, dispatch] = useContext(Context);
  const [isActive, setIsActive] = useState(false);
  const [cutscene, setCutscene] = useState({title: ''});
  const [activeSection, setActiveSection] = useState('initial');
  const [activeIndex, setActiveIndex] = useState(0);
  // HM, it's fine for now, but later concepts may require us to ask more questions further in the cutscene
  //  currently that'd cause collision issues, but consider a separate state for "all session answered questions" that can be the final push to Reducer, maybe
  //  of course, that would mean clearing out userResponses upon prompt click, but only in THAT scenario, currently we need them to persist for cutscene life
  const [userResponses, setUserResponses] = useState([]);


  // HERE: A "start up cutscene" function, which will first check to see if relevant variables are set for a 'paused' scene
  //  i.e. Having a saved activeSection, activeIndex, saved answers if relevant ... OR maybe we just start it fresh each time, for safety


  // NOTE: The below two functions are SUPER nearly identical, so maybe just add a param that sets 'progress' with option for 'finished'
  function pauseCutscene() {
    // Add a payload for setting this cutscene to 'paused', likely including all its current variables
    dispatch({type: actions.UNMOUNT_CUTSCENE});
    setIsActive(false);
    setCutscene({title: ''});
    setActiveSection('initial');
    setActiveIndex(0);
  }

  
  function handlePromptClick(linktarget) {

    // Currently doesn't do anything, but a handy anchor for later for two things:
    // 1) Having multi-user-input scenarios within a cutscene, pushing to a completedData array and clearing main userResponses state before moving on
    // 2) User input checking (will need more variables/checkables in play for that to work)
    switch (cutscene.content[activeSection][activeIndex].type) {
      case 'textinput':
        break;
      default:
        break;
    }

    // IN HERE: Maybe in some cases, we'll be passed something to 'remember' about the user's response or choice. Be prepared to handle that later.
    switch (cutscene.content[activeSection][activeIndex].next) {
      case 'advance':
        setActiveIndex(activeIndex => activeIndex + 1)
        break;
      case 'contingent':
        setActiveIndex(0);
        setActiveSection(linktarget);
        break;
      case 'end_scene':
        // Add a payload for setting this scene as DONE and applying any user choices to... whatever the user chose
        dispatch({type: actions.CHAOTIC_UPDATE, payload: userResponses});
        dispatch({type: actions.UNMOUNT_CUTSCENE});
        setIsActive(false);
        setCutscene({title: ''});
        setActiveSection('initial');
        setActiveIndex(0);
        break;
      default:
        break;
    }
  }

  function handleDynamicInput(enteredVal, stateVar, targetIndex) {
    let userInputCopy = JSON.parse(JSON.stringify(userResponses));
    userInputCopy[targetIndex] = {stateVar: stateVar, value: enteredVal};
    setUserResponses(userInputCopy);
  }

  // Probably add keyboard listeners to the window ONLY when cutscene is active? Can add keyboard interactivity that way, not just mouse.
  // For now, though, it's far easier to just have mouse-only/click-only features, at least until I'm far more comfortable with React key stuff.

  // This Cutscene needs unfettered access to all assets for the cutscene, such as for imgsrc and icons
  // This likely also means having a RAF or setInterval around here somewhere to parse animations in some cases

  // HERE: Consider adding a SAVE ability to record a cutscene being finished

  useEffect(() => {
    if (state.cutscene?.current?.id > -1) {
      setIsActive(true);
      // LOAD cutscene up, brah!
      setCutscene({...state.cutscene.current});
      // I think it's potentially reasonable to put this all in a function whose job is to 'start' the cutscene, beginning with LOADING,
      //    and that way I can add anchors for, say, an interval that processes all animations until we hit a text-y section
      //  ... this would be good not just for loading, but having this always being able to tell when animations/transitions should happen
      //  ... note that we can use STYLES and ANIMATIONS in CSS on our character-holding div (styled Character?) to accomplish most/all of it
    } else setIsActive(false);
  }, [state.cutscene]);

  useEffect(() => {
    if (cutscene.title.length) {
      // Have the first "thing" happen and await user input which will fire off the currently-nonexistent handler to decide what to do next
    }
  }, [cutscene]);

  // Might rejigger the below so the logic can handle NOT letting the user proceed for things like textinput types until text is input
  return (
    <div>
      {isActive &&
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'fixed', zIndex: '99', visibility: isActive ? 'visible' : 'hidden', width: '100vw', height: '100vh', opacity: '0.96', backgroundColor: 'white'}}>
        <h1>{cutscene.title}</h1>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '200px', width: '50vw', border: '1px solid black', borderRadius: '3px'}}>
          {cutscene.content[activeSection][activeIndex].text}
        </div>

        {cutscene.content[activeSection][activeIndex].type === 'textinput' &&
        <div>
          <div style={{display: 'flex', width: '80%', flexDirection: 'row'}}>
            {cutscene.content[activeSection][activeIndex].input.map((input, index) => (
              <input type='text' placeholder={input.placeholder} onChange={e => handleDynamicInput(e.target.value, input.stateVar, index)} style={{flex: '1', padding: '1rem', margin: '1rem'}} key={index}></input>
            ))}
          </div>
          {/* Ideally we add a 'check' here to not let the user click without everything entered... though the list of 'things to enter' could be variable */}
          <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <button style={{padding: '1rem', marginTop: '1rem'}} onClick={() => handlePromptClick()}>{cutscene.content[activeSection][activeIndex].prompt}</button>
          </div>
        </div>
        }

        {(cutscene.content[activeSection][activeIndex].next === 'advance' && cutscene.content[activeSection][activeIndex].type !== 'textinput') &&
          <div>
            <button style={{padding: '1rem', marginTop: '1rem'}} onClick={() => handlePromptClick()}>{cutscene.content[activeSection][activeIndex].prompt}</button>
          </div>
        }
        {cutscene.content[activeSection][activeIndex].next === 'end_scene' &&
          <div>
            <button style={{padding: '1rem', margin: '1rem'}} onClick={() => handlePromptClick()}>{cutscene.content[activeSection][activeIndex].prompt}</button>
          </div>
        }
        {cutscene.content[activeSection][activeIndex].type === 'prompt' &&
          <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            {cutscene.content[activeSection][activeIndex].prompt.map((prompt, index) => (
              <button style={{padding: '1rem', margin: '1rem'}} key={index} onClick={() => handlePromptClick(prompt.linkto)}>{prompt.text}</button>
            ))}
          </div>
        }

        <button style={{position: 'absolute', bottom: '1rem', right: '1rem', padding: '1rem', marginTop: '1rem'}} onClick={pauseCutscene}>(Pause/Escape)</button>
      </div>
      }
    </div>
  )
}


const Header = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  function logout() {
    axios.defaults.headers.common['Authorization'] = ``;
    localStorage.removeItem('prplAppData');
    dispatch({type: actions.LOGOUT});
    history.push('/login');
  }

  useEffect(() => {
    // Header's first load fires this off, which is when the app has just opened.
    const initLoadAppData = load();
    if (initLoadAppData !== null) {
      dispatch({type: actions.LOAD_USER, payload: initLoadAppData});
      axios.defaults.headers.common['Authorization'] = `Bearer ${initLoadAppData.token}`;
      history.push('/home');
    }
    // NOTE: It may make a lot more sense just to pop this code into the index.js file instead. The framework for this method is commented out over there.
  }, [dispatch, history]);

  return (
    <div className='flex-centered flex-col' id='app-header'>

      {(state.cutscene?.pending?.length > 0 && state.cutscene.current.id === -1) &&
      <div className='boingy' style={{position: 'fixed', display: 'flex', justifyContent: 'center', alignItems: 'center', bottom: '20px', right: '20px', width: '100px', height: '100px', borderRadius: '5px', backgroundColor: '#0AF'}}>
        You have cutscene.
      </div>
      }

      <div>
        <h1>Project : Playground</h1>
      </div>
      <div className='flex flex-row'>
        {!state.token &&
        <>
          <button className='btn' onClick={() => history.push('/')}>What's This?</button>
          <button className='btn' onClick={() => history.push('/login')}>Log In</button>
          <button className='btn' onClick={() => history.push('/register')}>Register</button>
        </>
        }
        {state.token &&
        <>
          <button className='btn' onClick={() => history.push('/home')}>Home</button>
          <button className='btn' onClick={() => history.push('/create_activity')}>Activity +!</button>
          <button className='btn' onClick={() => history.push('/body')}>Body</button>
          <button className='btn' onClick={() => history.push('/user')}>User</button>
          <button className='btn' onClick={logout}>Log Out</button>
        </>
        }
      </div>
    </div>
  )
}


const LandingPage = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    if (state.token) {
      // Kinda wiggly way to do it, but turning '/' into '/home' for logged in users :P
      history.push('/home');
    }
  }, []);

  return (
    <div>
      <h1>Hey there, {state.playgroundname}.</h1>
      <p>Let me tell you a bit about Project: Playground!</p>
    </div>
  )
}


const UserPage = () => {
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


const Body = () => {
  const [state, dispatch] = useContext(Context);
  const [activityName, setActivityName] = useState('');
  const [activityAmt, setActivityAmt] = useState(0);
  const [activityType, setActivityType] = useState('');
  const mounted = useRef(false);

  function addActivity() {
    if (activityName && activityAmt > 0 && activityType) {
      const newActivity = {name: activityName, amount: activityAmt, type: activityType};
      const today = dateToString();
      dispatch({type: actions.ADD_ACTIVITY, payload: {activity: newActivity, date: today}});
      setActivityName('');
      setActivityAmt(0);
      setActivityType('');
    }
  }

  useEffect(() => {
    // Good enough for now to avoid an extra DB push on component mounting
    if (!mounted.current) {
      mounted.current = true;
    } else {
      console.log(`I feel the need to update the backend with new STUFF!`);
      save(state);
      updateDB(state);
    }
    
  }, [state]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem'}}>
      <h1>Add an Activity</h1>
      <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', height: '300px', width: '300px', border: '1px solid #444', alignItems: 'center', padding: '1rem 0'}}>
        <input type='text' style={{padding: '1rem', fontSize: '0.8rem', width: '200px'}} placeholder={'activity name'} value={activityName} onChange={e => setActivityName(e.target.value)}></input>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '60%'}}>
          <input type='number' placeholder={'amt'} style={{marginTop: '1rem', padding: '1rem', width: '80px'}} value={activityAmt} onChange={e => setActivityAmt(e.target.value)} ></input>
          <input type='text' placeholder={'type'} style={{marginTop: '1rem', padding: '1rem', width: '80px'}} value={activityType} onChange={e => setActivityType(e.target.value)} ></input>
        </div>
        <Button onClick={addActivity} style={{marginTop: '1rem'}}>Add Activity</Button>
      </div>
    </div>
  )
}


const People = () => {
  return (
    <div>
      <h1>Find People Here!</h1>
    </div>
  )
}


const CreateActivity = () => {
  // Separate ViewActivity page, which can pass activities to this page to edit later. Let's go!
  const [state, dispatch] = useContext(Context);
  const [newActivity, setNewActivity] = useState({
    type: 'Workout',
    name: '',
    id: undefined,
    actions: [
      {
        name: 'Warm Up!',
        parts: [{name: 'Jumping Jacks', type: 'time', target: 30, rest: 15, next: 'timeout'}, {name: 'Hoppers', type: 'reps', target: -1, rest: 15, next: 'boop'}],
        repeat: 1,
        proceedType: 'loop',
        colorScheme: 'none'
      },
      {
        name: 'Work It, Girl',
        parts: [{name: 'Push-Ups', type: 'reps', target: -1, rest: 15, next: 'boop'}, {name: 'Rows', type: 'reps', target: -1, rest: 15, next: 'boop'}, {name: 'Goblet Squats', type: 'reps', target: -1, rest: 15, next: 'boop'}],
        repeat: 3,
        proceedType: 'sequential' // Just adding this for later -- the idea of doing each part through or supersetting?
      },
      {
        name: 'Cool It~',
        parts: [{name: 'Stretchies', type: 'time', target: 600, rest: 15, next: 'timeout', auto: false}], // auto for if timer just starts going right away on this sxn or not
        repeat: 1,
        proceedType: 'sequential' // Just adding this for later -- the idea of doing each part through or supersetting?
      }
    ]
  });
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentActionStats, setCurrentActionStats] = useState({name: '', parts: [], repeat: 1, proceedType: 'unknown'});

  // Thinking about the PARTS above... think about the different ways exercises can go (timer, AMRAP, ALAP, etc.) and build for those possibilites
  // Right now it's duration > 0 awaits timeout, duration -1 awaits user input
  // A bit clumsy, but can be refined as I test it

  /*
    Ok! There was no 'activities' saved for the User model. Now there is, it's an array. So, arr-of-obj, let's go with that.

    What defines an activity:
    ACTIONS involved and their relationship to each other (i.e. exercises in a workout)
      -- these actions have to be linked somehow, so either they're done for time, done for reps, done/undone, etc.
      -- for instance, a Workout can have a warm-up, exercises that segue into each other, and cooldown
      -- craft "pieces" of an activity that can be inserted (multiple times if desired)

    ... advanced, but maybe have a toggle to turn this immediately into a standalone program whilst saving?
    ... may or may not put it thusly, but a "how often do you want to do this" automagically program-ifies it

    Do be sure this stuff saves. :P Should be fine the 'normal' way, or reference the way Body does it above.


    ADD: 
    -- "Import": a way to browse through pre-existing Activities, such as if you're putting together a workout and want a pre-exisitng warmup in there


    FORMAT:
    -- I'm now thinking (aside from thinking I should plan these way better ahead of time):
      -> Stack of actions on the left side, with handy arrows... currently selected action pops to center stage with overview and editing buttons
      -> Condense the top of the page to have type, name, etc. as unobtrusive as possible in a row, not columns


    BRAINSTORM!
      Ok, so we got parts of a workout. Maybe "Cards" that go horizontally (row), with length of card indicating their content?
      So first card will just be hanging out by default. A PLUS button on the right will add a new card. Each card will have a DELETE option on it.
    
      IDEAS FOR LATER:
      -- Have the leftmost "sets" list give icon, color, name, maybe sets#, and height of each based on how long it is
      -- This idea could also be applied to each set, with each part being thicker if it's longer, and add a 'rest' appendix to each


  */

  function addNewSet() {
    const newSetName = `New Set ` + (newActivity.actions.length + 1);
    setNewActivity({...newActivity, actions: [...newActivity.actions, {name: newSetName, parts: [{name: 'Doing Something', duration: -1, next: 'boop'}], repeat: 1}]})
  }

  function editCurrentAction(part, value) {
    let activityCopy = JSON.parse(JSON.stringify(newActivity));
    activityCopy.actions[currentActionIndex][part] = value;
    setNewActivity(activityCopy);
  }

  function editCurrentPart(subpart, value) {
    let activityCopy = JSON.parse(JSON.stringify(newActivity));
    activityCopy.actions[currentActionIndex].parts[currentPartIndex][subpart] = value;
    setNewActivity(activityCopy);
  }

  function selectPartToEdit(indexOfPart) {
    // This fxn may be unnecessary. We'll see with time! May just be able to get away with an inline setCurrentPartIndex.
    setCurrentPartIndex(indexOfPart);
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '1rem'}}>


      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '400px', margin: '16px'}}>
        <button style={{padding: '16px', fontSize: '18px', backgroundColor: '#FA0F34', width: '120px'}}>Workout!</button>
        <input type='text' placeholder={newActivity.type + ' Name'} value={newActivity.name} onChange={e => setNewActivity({...newActivity, name: e.target.value})} style={{padding: '16px'}} ></input>
      </div>
      

      {/* Holder of Activity Defining/showing bits & pieces */}
      <div style={{display: 'flex', flex: '1', flexDirection: 'row', justifyContent: 'center', border: '1px solid #EEE', width: '90vw', height: '50vh', marginTop: '16px'}}> 

        {/* First column -- list of all our actions in this activity, descending column-wise */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid #EEF', marginRight: '16px'}}>
          
          {newActivity.actions.map((action, index) => (
            <div key={index} style={{display: 'flex', height: '50px', width: '200px', backgroundColor: currentActionIndex === index ? '#6EF' : '#0AF', marginBottom: '12px', justifyContent: 'center', alignItems: 'center'}} onClick={() => setCurrentActionIndex(index)} >{action.name}</div>
          ))}

        <button style={{display: 'flex', height: '50px', width: '200px', backgroundColor: '#0AF', marginBottom: '12px', justifyContent: 'center', alignItems: 'center'}} onClick={addNewSet} >Add Set/Section</button>

        </div>


        {/* Second column -- Holder for the overview of the card in question */}
        <div style={{display: 'flex', flexDirection: 'column', flex: '1'}}>
          
          <div style={{width: '200px', height: ((100 + newActivity.actions[currentActionIndex].parts.length * 50) + 'px'), border: '1px solid black', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
            {/* The preview Card itself */}
            <h3 style={{backgroundColor: 'red', color: 'white', fontWeight: '700', width: '100%', height: '40px', textAlign: 'center', paddingTop: '8px', borderTopLeftRadius: '6px', borderTopRightRadius: '6px'}}>{newActivity.actions[currentActionIndex].name}</h3>
            {newActivity.actions[currentActionIndex].parts.map((part, index) => (
              <div key={index} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: 'orangered', height: '40px', textAlign: 'center', color: 'white'}} onClick={() => selectPartToEdit(index)}>{part.name}</div>
            ))}
            <h3 style={{backgroundColor: 'red', color: 'white', fontWeight: '700', width: '100%', height: '40px', textAlign: 'center', paddingTop: '8px', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px'}}>{newActivity.actions[currentActionIndex].repeat}x</h3>
          </div>

        </div>


        {/* Third column - Widest, all the stuff to adjust and add bits to the concept here */}
        {/* NOTE: This section is currently WILDLY too large for its needs. When resdesigning, give lots more room for everything to breathe. */}
        <div style={{display: 'flex', flexDirection: 'column', flex: '3'}}>
          {/* 
            So, this section -- want to be able to:
            1) select parts of a set to edit (boop and arrow)
            2) edit the parts: name, type (maxREP, tarREP, maxTIM, tarTIM), rest time(s), times through, progression method(s) between exercises
            3) edit the set: set name, set repeat #
          */}

          <div style={{display: 'flex', flexDirection: 'column', height: '50%', border: '1px solid #DDE'}}>
            <h2>Edit Set Stats</h2>
            <input type='text' value={newActivity.actions[currentActionIndex].name} onChange={e => editCurrentAction('name', e.target.value)} style={{fontSize: '16px', padding: '18px'}}></input>
            <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
              <button style={{fontSize: '16px', padding: '18px'}} onClick={() => editCurrentAction('repeat', newActivity.actions[currentActionIndex].repeat > 1 ? newActivity.actions[currentActionIndex].repeat - 1 : 1)} >Less</button>
              <div style={{fontSize: '16px', padding: '18px'}}>{'Repeat ' + newActivity.actions[currentActionIndex].repeat + 'x'}</div>
              <button style={{fontSize: '16px', padding: '18px'}} onClick={() => editCurrentAction('repeat', newActivity.actions[currentActionIndex].repeat + 1)}>More</button>
            </div>
            {/* ADD: Set intensity, set type */}
          </div>

          <h2>Edit Exercise Details</h2>
          <input type='text' placeholder={`Exercise name`} value={newActivity.actions[currentActionIndex].parts[currentPartIndex].name} style={{fontSize: '16px', padding: '18px'}} onChange={e => editCurrentPart('name', e.target.value)} ></input>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <h3>Done For:</h3>
            <button style={{fontSize: '16px', padding: '18px', margin: '18px'}}>Time</button>
            <button style={{fontSize: '16px', padding: '18px', margin: '18px'}}>Reps</button>
          </div>
        </div>


      

      </div>
    </div>
  )
}

export default App;

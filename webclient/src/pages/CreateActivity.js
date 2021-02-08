import React, {useContext, useState, useEffect } from 'react';
import { Context } from '../context/context';

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

  export default CreateActivity;
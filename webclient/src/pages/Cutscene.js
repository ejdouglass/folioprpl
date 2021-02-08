import React, { useContext, useState, useEffect } from 'react';
import { Context, actions } from '../context/context';

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

export default Cutscene;
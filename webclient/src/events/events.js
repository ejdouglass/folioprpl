/*
    Here we're gonna try to figure out EVENT LOGIC for cutscenes.
    
    They currently live here on the frontend, but it makes sense to figure out how to push these new events as we go for all users.
    -- bake them into an ever-expanding "events.js" file when pushing new versions of the frontend
    -- pull them as a semi-static file or object from the backend periodically (in this case, optimize not to pull unnecessary events to some degree)

    Consider "choose your own adventure" concepts. Currently it's an ARRAY for easy progression,
        but it would also be possible to "pin" or "anchor" each content item (individually named) to its next point

    Factor around with CONTENT of each event so you can accomodate animations, transitions, speaker(s), prompts and saved answers, etc.
    -- Maybe a sneaky EVENT COMPONENT that can track everything and pass it along to local/global state? 
    -- That way it can consume ...args and such and I can just create a 'package' out of the event so it'll parse and run
    -- Cool idea, kind of daunting implementation

    Anyway, we've got a Cutscene component now that can handle all of this good stuff, so we can build in some functions and such for that fella.
    -- Gotta keep track of a lot, potentially, including user feedback/responses.
    -- Maybe a TYPE can be "animationStack" with the relevant info to do all animations in order? That could work.
        - animationStack could include transitions to the background color/opacity, "characters" moving around, objects moving around, etc.
    -- Could also do types like "sayStack" 

    CONSIDER
    -- having an extra FLAGS attribute so that if, say, the user dismisses the VERY FIRST TUTORIAL, a special note will appear to let them know
        where to find it again
    
    The GOAL of these events is to inform the user about stuff, at minimum, and give interaction and gain useful user info as well (ideally, it's all entertaining)
    -- Build this out to accomplish these goals

    OTHER PARTS
    -- I think I'll have "pending events" open up a list of events with little icons/images/name, so variables for that at some point would be neato
*/

// Would it be possible to have CONTENT include styles and durations?
// Also, thinking of making all PROMPTs into arrays like the 'contingent' fella to streamline/standardize the cutscene code
export const events = {
    introduction: {
        title: 'Welcome to Project: Playground',
        id: 0,
        content: {
            loading: [],
            initial: [
                {type: 'text', text: `Welcome! Nice to meet you. Your adventure is about to begin!`, prompt: 'Sounds good!', next: 'advance'},
                {type: 'textinput', text: `Ah! I should introduce myself. I am Tabula Rasa (Blob). What's your name?`, input: [{placeholder: 'First name', stateVar: 'firstname', value: 'input1'}, {placeholder: 'Last name', stateVar: 'lastname', value: 'input2'}], prompt: `That's my name!`, next: 'advance'},
                {type: 'prompt', text: `Nice to meet you! Are you ready?`, prompt: [{text: 'Yes', linkto: 'okaysure'}, {text: 'No', linkto: 'letmego'}], next: 'contingent'}
            ],
            okaysure: [
                {type: 'text', text: 'Hooray! Let us adventure!', prompt: `Yes, let's!`, next: 'end_scene'}
            ],
            letmego: [
                {type: 'text', text: `Oh, too bad.. well, I'll be around.`, prompt: `Seeya.`, next: 'end_scene'}
            ]
        },
        contentOld: [
            {type: 'say', content: 'Welcome! Your adventure is about to begin!'},
            {type: 'ask', content: 'Are you ready?', prompt: ['Yes', 'No']}
        ],
        flags: {},
        actors: [{
            who: 'tabula_rasa_0', // Could also have DIV DIMENSIONS/<Character /> dimensions manually set in here
            name: 'Tabula Rasa (Blob)',
            imgsrc: undefined
        }],
        icon: undefined,
        currentIndex: 0
    },

    tutorial_level: {
        title: `A Fresh Face`,
        id: 1,
        content: {},
        flags: {},
        actors: {},
        icon: undefined,
        currentIndex: 0
    }
}

/*
    More spitballing...

    So, CONTENT is an object containing "keys" for each section the user might find themselves in, essentially anchor points for cutscene options.
    -- Each 'anchor point' is a sequential array, so each part of the scene plays out linearly until a decision point
    -- Maybe replace TYPE with more options such as "animate" or a method such as "highlight()" to jiggle/foreground a speaking entity.
        -> Having preset positions such as "Speaker1" and "Speaker2" would make sense (put them on left/side of speech box by default)
    -- Add WHO to relevant areas so each text section has the speaker do a thing (OR have WHO be an object of actions/states/emotions to load for all charas
            during a given point in cutscene)
    -- Replace actors array with object? Maybe. So they can be referred by name instead of index. Makes sense.

    IDEA FOR LATER: Non-instantaneous text
*/
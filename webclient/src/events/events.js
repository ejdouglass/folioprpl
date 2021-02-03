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

// Would it be possible to have CONTENT include styles and durations 
export const events = {
    introduction: {
        title: 'Welcome to Project: Playground',
        id: 0,
        content: {
            loading: [],
            initial: [
                {type: 'text', text: 'Welcome! Nice to meet you. Your adventure shall begin shortly!', next: 'advance'},
                {type: 'prompt', text: 'Are you ready?', prompt: [{text: 'Yes', linkto: 'okaysure'}, {text: 'No', linkto: 'letmego'}], next: 'contingent'}
            ],
            okaysure: [
                {type: 'text', text: 'Hooray! Let us adventure!', next: 'end_scene'}
            ],
            letmego: [
                {type: 'text', text: `Oh, too bad.. well, I'll be around.`, next: 'end_scene'}
            ]
        },
        contentOld: [
            {type: 'say', content: 'Welcome! Your adventure is about to begin!'},
            {type: 'ask', content: 'Are you ready?', prompt: ['Yes', 'No']}
        ],
        flags: {},
        actors: [{
            who: 'tabula_rasa_0',
            name: 'Tabula Rasa Blob',
            imgsrc: undefined
        }],
        icon: undefined,
        currentIndex: 0
    }
}
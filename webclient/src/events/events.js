/*
    Here we're gonna try to figure out EVENT LOGIC for cutscenes.
    
    They currently live here on the frontend, but it makes sense to figure out how to push these new events as we go for all users.

    Consider "choose your own adventure" concepts.

    Factor around with CONTENT of each event so you can accomodate animations, transitions, speaker(s), prompts and saved answers, etc.
    -- Maybe a sneaky EVENT COMPONENT that can track everything and pass it along to local/global state? 
    -- That way it can consume ...args and such and I can just create a 'package' out of the event so it'll parse and run
    -- Cool idea, kind of daunting implementation
*/

export const events = {
    introduction: {
        content: [
            {type: 'say', content: 'Welcome! Your adventure is about to begin!'},
            {type: 'ask', content: 'Are you ready?', prompt: ['Yes', 'No']}
        ]
    }
}
## Scope committed
cooking buddy that lives in your kitchen. answers cooking questions, gives short sweet responses. basic memory so it remembers the conversation. prioritizing: character personality + clean UI + fast responses. getting the vibe right first.


## Scope cut
- advanced memory - will under-engineer this for now
- equipment recommendations / shopping suggestions
- multiple character personalities / cuisine specializations
- detailed cultural/historical meal context
- dietary icons

reasoning: I want to nail the friendly assistant + UI experience before adding other features.

## Assumptions made
- i can not worry about optimizing experience for mobile phone right now
- an agent that does the bare minimum and works is better than an agent that has all the features but is buggy
- a fast and simple agent is better than a slow and complicated agent
- a simple model like sonnet or haiku, or small gpt model knows enough about food and cooking on its own, it does not need web search or special api with cooking recipes

## Risks accepted
- might need to refactor memory system later if users want more sophisticated tracking
- keeping agent focused on cooking only (no general knowledge) might feel limiting
- starting with desktop version first is usually not best practice, but for a 3 hour time span it will help me with development speed
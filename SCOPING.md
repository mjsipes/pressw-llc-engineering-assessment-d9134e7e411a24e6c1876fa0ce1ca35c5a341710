## Scope committed
cooking buddy that lives in your kitchen. answers cooking questions, gives short sweet responses. basic memory so it remembers the conversation. prioritizing: character personality + clean UI + fast responses. getting the vibe right first.

## Scope cut
- sophisticated memory (preference tracking, meal history) - will under-engineer this for now
- equipment recommendations / shopping suggestions
- multiple character personalities / cuisine specializations
- detailed cultural/historical meal context

reasoning: want to nail the friendly assistant + UI experience before adding complex agent features. better to have one character that feels alive than 10 half-baked features.

## Assumptions made
- users care more about the experience feeling friendly than having every bell and whistle
- simple conversation memory > complex preference system for v1
- web search tool enough for recipe knowledge vs building custom recipe database

## Risks accepted
- might need to refactor memory system later if users want more sophisticated tracking
- keeping agent focused on cooking only (no general knowledge) might feel limiting
- starting with one character means might need UI redesign if we add multiple later
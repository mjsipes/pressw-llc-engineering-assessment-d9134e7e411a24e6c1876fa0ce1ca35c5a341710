# Trade-offs

## What you actually built vs. what you scoped

So in the end i built a bare minimum agent + app with three features:
1. Agent can chat
2. Agent and user have a shared document for info on available cooking tools
3. A ui component for all previously created recipes

Unfortunately the features are buggy and do not work as I intended they would.


## Specific trade-offs you made and why

1. No web search / recipe API integration: I originally wanted the agent to search the web and pull real recipes with photos. But honestly, implementing a reliable web scraper or integrating with a recipe API would have eaten up most of my time. I decided to lean on the base knowledge of the LLM instead. The model knows enough about cooking to give decent suggestions without needing external data. This trade-off let me focus on the UI and getting the agent personality right.

2. Simple memory instead of sophisticated context: I built a basic shared document for kitchen equipment instead of a proper memory system. I wanted something like a persistent user profile, but implementing proper state management with LangGraph checkpoints would have been time consuming. The shared document approach is janky but it got me something that sort of works.

3. Desktop-first UI: Mobile is usually where you'd use a cooking assistant (phone propped up in the kitchen), but I built for desktop. This is the wrong priority for a real product but it saved me time during development. I can prototype faster when I'm not wrestling with responsive design.

4. No streaming: The chat doesn't stream responses. It just waits and then dumps the full message. This feels slow and not modern. I know how to implement streaming with FastAPI and LangGraph but it would have added another layer of complexity to both the backend and frontend. I chose to get the basic flow working first.

5. Minimal error handling: If the OpenAI API fails or the agent does something unexpected, the app probably breaks. I didn't build retry logic or graceful degradation. In a real system this would be critical but for a prototype I accepted the risk.


## What you'd do next with more time

1. Fix the agent tools: Right now the agent can't actually update the kitchen equipment doc reliably. I'd make sure the tool calling works properly and the agent can read and write to shared state.

2. Add recipe search: Integrate Tavily or Perplexity API to search for real recipes. Parse the results and extract images, ingredient lists, and instructions. This would make the recipes way more useful.

3. Streaming responses: Make the chat feel responsive by streaming tokens as they arrive instead of waiting for the full response.

4. Better UI polish: Add images to recipe cards, fix the scrolling issue between equipment and recipes, add some color and personality to match the friendly assistant vibe.

5. Dietary restrictions handling: Add a way for users to specify allergies or dietary preferences and make sure the agent respects them.

6. Mobile responsive design: Make it actually usable on a phone since that's where people would use this in a kitchen.

7. Proper memory system: Implement LangGraph checkpointing so conversations persist across sessions and the agent remembers user preferences.


## Known issues or unhandled cases

1. Kitchen equipment tool doesn't work consistently: The agent doesn't reliably update or reference the equipment list. Sometimes it acknowledges equipment you mention but doesn't save it.

2. Recipes have no titles: They just show up as ingredient lists with no clear name or description.

3. No images: Recipe cards are text-only which makes them less appealing.

4. Scroll container issue: The equipment and recipes share one scroll box so when you have lots of recipes you lose visibility of the equipment section.

5. Talking specifically about cooking: I havent built the charcter personality up yet so if I ask about somethign unrelated to cooking it will propose a recipe but I kinda want to make it seem like the agent just doesnt know anything about the world other than cooking. I feel like it would come across as more cute and the user could get frustrated if it just sees the agent doesnt want to talk about other things.

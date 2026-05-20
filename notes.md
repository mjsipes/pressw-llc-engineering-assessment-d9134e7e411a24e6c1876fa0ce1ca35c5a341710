PantryPal is an early-stage B2C startup building an AI-powered cooking assistant. They've engaged us to build the first working version of their core product: a conversational assistant that helps users figure out what to cook.

A Python backend using FastAPI and LangGraph
LLM-driven tool use: the model decides when to invoke tools (no hardcoded sequences)
At least one external tool (web search or equivalent)
All LLM calls routed through LangChain (no model-specific SDKs directly)
A chat frontend (stack of your choice; we recommend something you're fast in)
Docker setup, so we can clone and run


vibe: cute little kitchen crawler that lives in your kitchen, loves to cook, loves to talk to you, but really doesnt know anythign else about the world. gives short and sweet responses.

my take on memory: going to start with under engineering.

inspo:
bring these characters to life as chefs in your kitchen - https://youtube.com/shorts/S7ggdxMpb3U?si=a8dR-bXPZc036qfV
dietaryicons.png = the icons for dietary restrictions
easy ui component to manage what you have in your kitchen, what you dont have. it is a list of cooking equitment you have. you can edit it, the ai agent can edit it.
idea: maybe we have different characters that specialize in different cuisines, it would be cool if the app can give you really detailed history of different meals in different cuisines and you learned about different cultures that way. then it could also inspire new cooking equitment for you to purchase like if you are cooking a mexican dish it can recomend to purchase one of those stone crushing bowls

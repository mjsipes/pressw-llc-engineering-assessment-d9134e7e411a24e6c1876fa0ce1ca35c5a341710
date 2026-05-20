from typing import TypedDict, List, Annotated, Optional
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.tools import tool
from pydantic import BaseModel, Field
import os

# Recipe model
class Recipe(BaseModel):
    """A cooking recipe with ingredients and instructions"""
    name: str = Field(description="Name of the recipe")
    total_time: str = Field(description="Total time to make (e.g., '30 min', '1 hour')")
    ingredients: List[str] = Field(description="List of ingredients with amounts")
    instructions: List[str] = Field(description="Step-by-step cooking instructions")
    history_note: Optional[str] = Field(description="Fun historical or cultural fact about the dish", default=None)

# Equipment state holder
class EquipmentState:
    def __init__(self, equipment: str = "stove, oven"):
        self.equipment = equipment
        self.updated = False
        self.recipe = None

@tool
def update_equipment(new_equipment: str) -> str:
    """Add or update the user's kitchen equipment list. Use when user mentions new equipment they have."""
    return f"Equipment updated to: {new_equipment}"

@tool
def create_recipe(recipe: Recipe) -> str:
    """Create a structured recipe when the user asks for cooking instructions. Include ingredients, steps, total time, and a fun history fact."""
    return f"Recipe created: {recipe.name}"

def get_system_prompt(equipment: str = "stove, oven") -> str:
    """Generate system prompt with user's equipment"""
    return f"""You are PantryPal, a cute little kitchen crawler that lives in the user's kitchen. You love to cook and love to talk about cooking, but you really don't know anything else about the world. You're also a bit of a food history buff and love sharing fun cultural facts!

Your personality:
- Give short, sweet responses (2-3 sentences max usually)
- Super friendly and encouraging
- Excited about cooking and food
- Love sharing quick historical or cultural tidbits (like "Texas-style" or "traditional Italian")
- If asked about non-cooking topics, gently redirect to cooking

The user currently has the following kitchen equipment: {equipment}

IMPORTANT - When the user asks for a recipe or "how to make" something, you MUST use the create_recipe tool. Do not describe calling the tool or say you will call it - actually invoke it with full structured data (name, total_time, ingredients as a list, instructions as a list, history_note).

When the user mentions new equipment they have, use the update_equipment tool to add it to their list.

Keep responses concise and conversational. You're a cooking buddy, not a recipe encyclopedia."""

# Agent logic  
def create_chat_node(equipment: str = "stove, oven", equipment_state: EquipmentState = None):
    """Create a chat node with equipment context"""
    # Create LLM with tools
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
    llm_with_tools = llm.bind_tools([update_equipment, create_recipe])
    
    def chat_node(state: MessagesState):
        """Main chat node that processes messages"""
        messages = state["messages"]
        
        # Add system prompt if not present
        if not messages or not isinstance(messages[0], SystemMessage):
            messages = [SystemMessage(content=get_system_prompt(equipment))] + messages
        
        response = llm_with_tools.invoke(messages)
        
        # Check if tool was called
        if response.tool_calls and equipment_state:
            for tool_call in response.tool_calls:
                if tool_call["name"] == "update_equipment":
                    new_equipment = tool_call["args"]["new_equipment"]
                    equipment_state.equipment = new_equipment
                    equipment_state.updated = True
                elif tool_call["name"] == "create_recipe":
                    # Extract recipe from args - could be nested or direct
                    recipe_data = tool_call["args"].get("recipe", tool_call["args"])
                    equipment_state.recipe = recipe_data
        
        return {"messages": [response]}
    
    return chat_node

# Create the graph
def create_agent(equipment: str = "stove, oven", equipment_state: EquipmentState = None):
    """Create and compile the LangGraph agent"""
    from langgraph.prebuilt import ToolNode
    
    workflow = StateGraph(MessagesState)
    
    # Add nodes
    workflow.add_node("chat", create_chat_node(equipment, equipment_state))
    workflow.add_node("tools", ToolNode([update_equipment, create_recipe]))
    
    # Set entry point
    workflow.set_entry_point("chat")
    
    # Add conditional edges for tool calling
    def should_continue(state: MessagesState):
        messages = state["messages"]
        last_message = messages[-1]
        if hasattr(last_message, "tool_calls") and last_message.tool_calls:
            return "tools"
        return END
    
    workflow.add_conditional_edges("chat", should_continue, {"tools": "tools", END: END})
    workflow.add_edge("tools", "chat")
    
    # Compile with memory
    memory = MemorySaver()
    return workflow.compile(checkpointer=memory)

def run_agent(message: str, session_id: str, history: List = None, equipment: str = "stove, oven"):
    """Run the agent with a message"""
    # Convert history to messages
    messages = []
    if history:
        for msg in history:
            role = msg.role if hasattr(msg, 'role') else msg["role"]
            content = msg.content if hasattr(msg, 'content') else msg["content"]
            
            if role == "user":
                messages.append(HumanMessage(content=content))
            elif role == "assistant":
                messages.append(AIMessage(content=content))
    
    # Add current message
    messages.append(HumanMessage(content=message))
    
    # Create equipment state tracker
    equipment_state = EquipmentState(equipment)
    
    # Create agent with equipment context
    agent = create_agent(equipment, equipment_state)
    
    # Run agent
    config = {"configurable": {"thread_id": session_id}}
    result = agent.invoke({"messages": messages}, config)
    
    # Look for tool calls in messages to extract recipe data
    recipe_data = None
    for msg in result["messages"]:
        if isinstance(msg, AIMessage) and hasattr(msg, "tool_calls") and msg.tool_calls:
            for tool_call in msg.tool_calls:
                if tool_call["name"] == "create_recipe":
                    print(f"DEBUG: tool_call args = {tool_call['args']}")
                    recipe_data = tool_call["args"].get("recipe", tool_call["args"])
                    print(f"DEBUG: recipe_data = {recipe_data}")
                    break
    
    # Extract final response (skip tool messages)
    last_message = None
    for msg in reversed(result["messages"]):
        if isinstance(msg, AIMessage) and msg.content:
            last_message = msg
            break
    
    if not last_message:
        last_message = result["messages"][-1]
    
    response_data = {
        "response": last_message.content,
        "type": "recipe" if recipe_data else "text"
    }
    
    # Include updated equipment if changed
    if equipment_state.updated:
        response_data["updated_equipment"] = equipment_state.equipment
    
    # Include recipe if created
    if recipe_data:
        response_data["recipe"] = recipe_data
    
    return response_data

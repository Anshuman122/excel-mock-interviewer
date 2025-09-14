from uuid import uuid4

# In-memory session storage
sessions = {}  # {session_id: {"questions": [], "answers": [], "current_index": 0}}

def start_session():
    session_id = str(uuid4())
    sessions[session_id] = {
        "questions": ["Explain VLOOKUP", "What is SUM formula?", "Describe Pivot Tables"],
        "answers": [],
        "current_index": 0
    }
    return session_id, sessions[session_id]["questions"][0]

def record_answer(session_id, answer):
    session = sessions.get(session_id)
    if not session:
        raise ValueError("Invalid session_id")

    # Save answer
    session["answers"].append(answer)
    session["current_index"] += 1

    # Return next question or None if done
    if session["current_index"] < len(session["questions"]):
        return session["questions"][session["current_index"]]
    else:
        return None

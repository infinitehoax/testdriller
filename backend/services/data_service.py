import json
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'waec_questions.json')

# In-memory cache to prevent redundant disk I/O
_cached_questions = None

def load_questions() -> dict:
    """Loads and returns all questions from the JSON data file, using cache if available."""
    global _cached_questions
    if _cached_questions is not None:
        return {"success": True, "data": _cached_questions}

    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            _cached_questions = json.load(f)
        return {"success": True, "data": _cached_questions}
    except FileNotFoundError:
        return {"success": False, "error": "waec_questions.json not found. Please add your questions file."}
    except json.JSONDecodeError as e:
        return {"success": False, "error": f"Invalid JSON in questions file: {str(e)}"}
    except Exception as e:
        return {"success": False, "error": f"Failed to load questions: {str(e)}"}



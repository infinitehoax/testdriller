# 👩‍🏫 Teacher's Guide: How to Format Testdriller Questions

This document provides the definitive standard for adding and formatting questions in the Testdriller.

---

## 📂 File Location

Questions are stored in: `backend/data/testdriller_questions.json` (Note: Keeping filename for backward compatibility or will rename in future).

This file is a **JSON array** where each element represents a subject.

---

## 🏗️ Multi-Subject JSON Structure

The top-level structure must be an array of subject objects.

```json
[
  {
    "subject": "Subject Name (e.g. Physics)",
    "obj": [ /* Array of OBJ questions */ ],
    "theory": [ /* Array of Theory questions */ ]
  },
  {
    "subject": "Another Subject",
    "obj": [],
    "theory": []
  }
]
```

---

## 🔤 OBJ (Multiple Choice) Format

Each OBJ question in the `obj` array should follow this schema:

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | A unique identifier. |
| `year` | String | The examination year (e.g., "2023"). Users can filter by this. |
| `topic` | String | The specific topic. Users can search and filter by this. |
| `question` | String | The text of the question. Supports Rich Formatting. |
| `options` | Object | A map with keys `"A"`, `"B"`, `"C"`, `"D"`. |
| `correct_option`| String | The correct letter: `"A"`, `"B"`, `"C"`, or `"D"`. |
| `explanation` | String | (Optional) Shown after answering. Explains the "Why". |

### Example:
```json
{
  "id": "obj_005",
  "year": "2023",
  "topic": "Cell Biology",
  "question": "Which of the following is the powerhouse of the cell?",
  "options": {
    "A": "Nucleus",
    "B": "Ribosome",
    "C": "Mitochondrion",
    "D": "Vacuole"
  },
  "correct_option": "C",
  "explanation": "The mitochondrion produces ATP through cellular respiration."
}
```

---

## ✍️ Theory Format (with Sub-Questions)

Theory questions are divided into sub-questions (1a, 1b, etc.) to ensure high AI grading accuracy.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | A unique identifier. |
| `year` | String | The examination year (e.g., "2023"). |
| `topic` | String | The specific topic. |
| `main_context` | String | The overall question header (e.g., "Question 1 (15 Marks)"). |
| `sub_questions`| Array | List of sub-question objects. |

### Sub-Question Schema:
| Field | Type | Description |
| :--- | :--- | :--- |
| `sub_id` | String | Unique ID for the sub-unit. |
| `label` | String | The Testdriller label (e.g., `"1(a)(i)"`). |
| `question` | String | The specific prompt for this unit. |
| `rubric` | String | **The Marking Scheme.** Be as detailed as possible. |
| `max_marks` | Number | Maximum score for this sub-unit. |

---

## ✨ Rich Formatting Standards

You can use Markdown, LaTeX ($...$ or $$... $$), Tables, and Images.

---

## 💡 Pro-Tips for Rubrics
- **Be Quantitative**: "Award 1 mark for each point, max 3."
- **Provide Examples**: "Acceptable answers include: [list...]"
- **Define Partial Credit**: "Award 1 mark if they mention 'energy' but forget 'ATP'."

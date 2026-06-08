import unittest
from unittest.mock import patch
import json
import sys
import os

# Add the project root to sys.path to import backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app

class TestAPIRoutes(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    @patch('backend.routes.api_routes.load_questions')
    def test_get_questions(self, mock_load):
        mock_load.return_value = {"success": True, "data": {"obj": [], "theory": []}}

        response = self.client.get('/api/questions')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data, {"obj": [], "theory": []})

    @patch('backend.routes.api_routes.explain_concept')
    def test_explain(self, mock_explain):
        mock_explain.return_value = "Detailed explanation"

        response = self.client.post('/api/explain', json={"question": "Test?"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"explanation": "Detailed explanation"})

    @patch('backend.routes.api_routes.grade_sub_question')
    def test_grade_answer(self, mock_grade):
        mock_grade.return_value = {"score": 2, "feedback": "Good"}

        payload = {
            "sub_question": "Q1",
            "student_answer": "A1",
            "rubric": "R1",
            "max_marks": 2
        }
        response = self.client.post('/api/grade', json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["score"], 2)
        self.assertEqual(data["max_marks"], 2)

    def test_get_config(self):
        response = self.client.get('/api/config')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("pass_threshold", data)
        self.assertIn("has_api_key", data)

    @patch('backend.routes.api_routes.TrophyService.track_event')
    def test_track_mastery_name_handling(self, mock_track):
        mock_track.return_value = {"status": "ok"}

        # Case 1: Valid name
        self.client.post('/api/track-mastery', json={"userId": "u1", "userName": "Jules"})
        mock_track.assert_called_with("u1", "Jules", "testdriller", 1)

        # Case 2: Missing name
        self.client.post('/api/track-mastery', json={"userId": "u1"})
        mock_track.assert_called_with("u1", "Anonymous Testdriller", "testdriller", 1)

        # Case 3: Name is 'Student'
        self.client.post('/api/track-mastery', json={"userId": "u1", "userName": "Student"})
        mock_track.assert_called_with("u1", "Anonymous Testdriller", "testdriller", 1)

if __name__ == '__main__':
    unittest.main()

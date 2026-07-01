import requests
import json
import time

API_URL = "http://127.0.0.1:8001/ask"

# Golden dataset: List of questions and the keywords/phrases expected in the answer
evaluation_data = [
    {
        "question": "How many days of Paid Time Off (PTO) do employees receive per year?",
        "expected_keywords": ["20"]
    },
    {
        "question": "When do non-exempt employees receive holiday pay?",
        "expected_keywords": ["three months"]
    },
    {
        "question": "Is there a cap on PTO?",
        "expected_keywords": ["25 days", "25"]
    },
    {
        "question": "What is the floating day?",
        "expected_keywords": ["any day", "choose", "unpaid time off"]
    },
    {
        "question": "Will I be compensated for accrued leave if terminated for cause?",
        "expected_keywords": ["not", "no", "won't", "will not"]
    }
]

def evaluate_pipeline():
    print("Starting evaluation of the RAG pipeline...")
    print("-" * 50)
    
    passed = 0
    total = len(evaluation_data)
    
    for idx, item in enumerate(evaluation_data):
        question = item["question"]
        expected_keywords = item["expected_keywords"]
        
        print(f"Q{idx+1}: {question}")
        
        try:
            response = requests.post(API_URL, json={"question": question})
            response.raise_for_status()
            
            data = response.json()
            answer = data.get("answer", "")
            
            # Check if ANY of the expected keywords are in the answer for simplicity.
            success = any(keyword.lower() in answer.lower() for keyword in expected_keywords)
            
            if success:
                print("Result: PASS")
                passed += 1
            else:
                print("Result: FAIL")
                print(f"Expected one of: {expected_keywords}")
                print(f"Generated Answer: {answer}")
                
        except requests.exceptions.RequestException as e:
            print(f"Result: ERROR ({e})")
            
        print("-" * 50)
        time.sleep(1) # Slight pause to avoid overloading the API
        
    accuracy = (passed / total) * 100
    print(f"Final Accuracy: {passed}/{total} ({accuracy:.2f}%)")

if __name__ == "__main__":
    evaluate_pipeline()

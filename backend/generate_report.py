from .llm_rubric import evaluate_answer
from .excel_tests import validate_excel

def generate_report(text_answer, rubric, excel_file_path=None):
    text_eval = evaluate_answer(text_answer, rubric)
    
    excel_eval = None
    if excel_file_path:
        excel_eval = validate_excel(excel_file_path)

    # Combine
    report = {
        "text_eval": text_eval,
        "excel_eval": excel_eval
    }
    
    return report

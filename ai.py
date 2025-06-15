import os
import PyPDF2
from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import TfidfVectorizer


model = SentenceTransformer('all-MiniLM-L6-v2')


def extract_text_from_pdf(file_path: str) -> str:
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text() or ''
    return text


def get_resume_text(input_data: str, is_pdf: bool = False) -> str:
    if is_pdf:
        if not os.path.isfile(input_data):
            raise FileNotFoundError("PDF file not found.")
        return extract_text_from_pdf(input_data)
    return input_data


def semantic_score(resume_text: str, job_description: str) -> float:
    emb_resume = model.encode(resume_text, convert_to_tensor=True)
    emb_job = model.encode(job_description, convert_to_tensor=True)
    return round(util.cos_sim(emb_resume, emb_job).item() * 100, 1)


def skills_match(resume_text: str, skills: list[str]) -> tuple[float, list[str]]:
    tfidf = TfidfVectorizer().fit([resume_text])
    tokens = tfidf.get_feature_names_out()
    matched = [skill for skill in skills if skill.lower() in map(str.lower, tokens)]
    return round(len(matched) / len(skills) * 100, 1), matched


def analyze_candidate(input_data: str, job_description: str, key_skills: list[str], is_pdf: bool = False) -> dict:
    resume_text = get_resume_text(input_data, is_pdf)
    overall = semantic_score(resume_text, job_description)
    skill_score, found_skills = skills_match(resume_text, key_skills)
    missing_skills = [s for s in key_skills if s not in found_skills]

    return {
        "Общий анализ": f"{overall}%",
        "Оценка скиллов": f"{skill_score}% соответствие ключевым навыкам",
        "Сильные стороны": found_skills,
        "Слабые стороны": missing_skills
    }


if __name__ == "__main__":
    job_text = "Требуется разработчик с опытом в Python, Django, PostgreSQL, Docker, и REST API."
    candidate_pdf = "resume.pdf"  # или текст как строка
    skills = ["Python", "Django", "PostgreSQL", "Docker", "REST API"]

    result = analyze_candidate(candidate_pdf, job_text, skills, is_pdf=True)

    for k, v in result.items():
        print(f"{k}: {', '.join(v) if isinstance(v, list) else v}")

import os
import fitz  
import json

import pytesseract
import pdfplumber
import docx
import re
import requests
from bs4 import BeautifulSoup
from typing import Dict
from sentence_transformers import SentenceTransformer, util

# ---------- TEXT EXTRACTION ----------
def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        with fitz.open(file_path) as pdf:
            for page in pdf:
                page_text = page.get_text()
                if page_text.strip():
                    text += page_text
                else:
                    pix = page.get_pixmap()
                    text += pytesseract.image_to_string(pix.tobytes(), lang='eng')
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return text

def extract_text(file_path: str) -> str:
    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            return "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    elif file_path.endswith(".docx"):
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    return ""

# ---------- SMART LINK EXTRACTION ----------
def extract_links_with_annotations(file_path: str, text: str) -> Dict[str, str]:
    links = {"github": None, "leetcode": None, "codechef": None}

    # Extract from visible text
    urls = re.findall(r'https?://[^\s,;)\]]+', text)
    for url in urls:
        url = url.strip()
        if "github.com" in url and not links["github"]:
            links["github"] = url
        elif "leetcode.com" in url and not links["leetcode"]:
            links["leetcode"] = url
        elif "codechef.com" in url and not links["codechef"]:
            links["codechef"] = url

    # Extract from annotations
    try:
        with fitz.open(file_path) as doc:
            for page in doc:
                link_annots = page.get_links()
                for link in link_annots:
                    uri = link.get("uri", "")
                    if uri:
                        uri = uri.strip()
                        if "github.com" in uri and not links["github"]:
                            links["github"] = uri
                        elif "leetcode.com" in uri and not links["leetcode"]:
                            links["leetcode"] = uri
                        elif "codechef.com" in uri and not links["codechef"]:
                            links["codechef"] = uri
    except Exception as e:
        print(f"Error reading annotations from {file_path}: {e}")

    return links

# ---------- PROFILE STATS ----------
def get_github_stats(url: str):
    username = url.rstrip("/").split("/")[-1]
    try:
        user_data = requests.get(f"https://api.github.com/users/{username}").json()
        events_data = requests.get(f"https://api.github.com/users/{username}/events/public").json()
        dates = set(event["created_at"][:10] for event in events_data if "created_at" in event)
        return {
            "url": url,
            "total_contributions": len(events_data),
            "active_days": len(dates),
            "public_repos": user_data.get("public_repos")
        }
    except Exception as e:
        return {"url": url, "error": str(e)}

def get_leetcode_stats(url: str):
    username = url.rstrip("/").split("/")[-1]
    try:
        api_url = f"https://leetcode-stats-api.herokuapp.com/{username}"
        r = requests.get(api_url)
        if r.status_code != 200:
            return {"url": url, "error": "LeetCode profile not found or unavailable."}
        data = r.json()
        return {
            "url": url,
            "total_problems_solved": data.get("totalSolved"),
            "ranking": data.get("ranking"),
            "contest_rating": data.get("contestRating")
        }
    except Exception as e:
        return {"url": url, "error": str(e)}

def get_codechef_stats(url: str):
    username = url.rstrip("/").split("/")[-1]
    profile_url = f"https://www.codechef.com/users/{username}"
    stats = {"url": url}
    try:
        r = requests.get(profile_url)
        if r.status_code != 200:
            return stats

        soup = BeautifulSoup(r.text, "html.parser")
        rating_div = soup.find("div", class_="rating-number")
        if rating_div:
            match = re.search(r'\d+', rating_div.text)
            if match:
                stats["rating"] = int(match.group())

        solved_section = soup.find("section", class_="rating-data-section problems-solved")
        if solved_section:
            h5_tag = solved_section.find("h5")
            if h5_tag:
                match = re.search(r'\d+', h5_tag.text)
                if match:
                    stats["fully_solved"] = int(match.group())

        ranks = soup.find_all("a", class_="inline-list")
        for rank in ranks:
            if "Global Rank" in rank.text:
                match = re.search(r"Global Rank\s*:\s*(\d+)", rank.text)
                if match:
                    stats["global_rank"] = int(match.group(1).replace(",", ""))
            elif "Country Rank" in rank.text:
                match = re.search(r"Country Rank\s*:\s*(\d+)", rank.text)
                if match:
                    stats["country_rank"] = int(match.group(1).replace(",", ""))
    except Exception as e:
        stats["error"] = str(e)
    return stats

# ---------- CODING SCORE ----------
def calculate_coding_score(github_data, leetcode_data, codechef_data):
    score = 0
    max_vals = {
        "total_contributions": 500,
        "active_days": 150,
        "public_repos": 50,
        "total_problems_solved": 800,
        "ranking": 100000,
        "rating": 2500,
        "fully_solved": 500
    }

    if "total_contributions" in github_data:
        score += min(github_data["total_contributions"], max_vals["total_contributions"]) / max_vals["total_contributions"] * 0.10
    if "active_days" in github_data:
        score += min(github_data["active_days"], max_vals["active_days"]) / max_vals["active_days"] * 0.05
    if "public_repos" in github_data:
        score += min(github_data["public_repos"], max_vals["public_repos"]) / max_vals["public_repos"] * 0.05

    if "total_problems_solved" in leetcode_data:
        score += min(leetcode_data["total_problems_solved"], max_vals["total_problems_solved"]) / max_vals["total_problems_solved"] * 0.15
    if "ranking" in leetcode_data and isinstance(leetcode_data["ranking"], int):
        score += (1 - min(leetcode_data["ranking"], max_vals["ranking"]) / max_vals["ranking"]) * 0.10

    if "rating" in codechef_data:
        score += min(codechef_data["rating"], max_vals["rating"]) / max_vals["rating"] * 0.10
    if "fully_solved" in codechef_data:
        score += min(codechef_data["fully_solved"], max_vals["fully_solved"]) / max_vals["fully_solved"] * 0.10

    if github_data.get("url") and leetcode_data.get("url") and codechef_data.get("url"):
        score += 0.05

    return round(score, 3)

# ---------- SIMILARITY CHECK ----------
def get_job_description_from_pdf(folder_path: str) -> str:
    for file_name in os.listdir(folder_path):
        if file_name.lower().endswith(".pdf"):
            return extract_text_from_pdf(os.path.join(folder_path, file_name))
    return ""

def analyze_resumes_with_job_description(resume_folder: str, job_description: str, top_n: int = 10):
    resumes = []
    resume_texts = []

    for file_name in os.listdir(resume_folder):
        if file_name.lower().endswith(".pdf"):
            file_path = os.path.join(resume_folder, file_name)
            text = extract_text_from_pdf(file_path)
            resumes.append((file_name, text))
            resume_texts.append(text)

    model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')
    resume_embeddings = model.encode(resume_texts, convert_to_tensor=True)
    job_embedding = model.encode(job_description, convert_to_tensor=True)

    cosine_scores = util.cos_sim(job_embedding, resume_embeddings)[0]
    ranked = sorted(
        zip([name for name, _ in resumes], cosine_scores.tolist(), [text for _, text in resumes]),
        key=lambda x: x[1],
        reverse=True
    )
    return ranked[:top_n]

# ---------- MAIN ----------
if __name__ == "__main__":
    resume_folder = "./uploads"
    job_desc_folder = "./jobdesc"

    job_description = get_job_description_from_pdf(job_desc_folder)
    if not job_description:
        print("Job description not found. Exiting.")
        exit()

    top_resumes = analyze_resumes_with_job_description(resume_folder, job_description)

output_data = []

for idx, (name, score, text) in enumerate(top_resumes, 1):
    file_path = os.path.join(resume_folder, name)
    links = extract_links_with_annotations(file_path, text)

    stats_github = get_github_stats(links["github"]) if links["github"] else {}
    stats_leetcode = get_leetcode_stats(links["leetcode"]) if links["leetcode"] else {}
    stats_codechef = get_codechef_stats(links["codechef"]) if links["codechef"] else {}

    coding_score = calculate_coding_score(stats_github, stats_leetcode, stats_codechef)

    output_data.append({
        "name": name,
        "compatibility_score": score,
        "coding_profiles": links,
        "github_stats": stats_github,
        "leetcode_stats": stats_leetcode,
        "codechef_stats": stats_codechef,
        "coding_score": coding_score
    })

os.makedirs("output", exist_ok=True)
with open("output/resume_analysis_output.json", "w") as f:
    json.dump(output_data, f, indent=4)
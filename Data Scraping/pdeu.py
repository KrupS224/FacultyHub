import requests
from bs4 import BeautifulSoup as bs
import pandas as pd
import PyPDF2
from io import BytesIO

url = 'https://www.nift.ac.in/facultyprofiles'
base = 'https://www.nift.ac.in'
response = requests.get(url)


def getPDFData(response):
    pdf_file = BytesIO(response.content)
    pdf_reader = PyPDF2.PdfReader(pdf_file)

    pdf_text = ""
    for page_num in range(len(pdf_reader.pages)):
        page_obj = pdf_reader.pages[page_num]
        pdf_text += page_obj.extract_text()

    return pdf_text


if response.status_code == 200:
    soup = bs(response.content, 'html.parser')
    p_tags = soup.find(
        'div', class_='list-style-square').find_all('p')

    links = []
    for p in p_tags:
        link = base + p.find('a')['href']
        links.append(link)

    faculty_list = []
    cnt = 1
    for link in links:
        response = requests.get(link)
        if response.status_code == 200:
            data = getPDFData(response)
            print(data)
            if cnt == 2:
                break
            cnt += 1
else:
    print("Failed to load page")

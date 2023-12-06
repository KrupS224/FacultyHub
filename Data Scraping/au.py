import requests
from bs4 import BeautifulSoup as bs
import pandas as pd

base = 'https://ahduni.edu.in'
url = 'https://ahduni.edu.in/faculty/'
response = requests.get(url)

soup = bs(response.content, 'html.parser')
departments = soup.find_all('div', class_='card')
departments = [base + department.find('h3').find('a')['href']
               for department in departments]

email_list = []
# print(departments)

for department in departments:
    response = requests.get(department)
    soup = bs(response.content, 'html.parser')

    faculty_cards = soup.find(
        'div', class_='tab-content').find_all('div', class_='tab-pane')
    href_list = []

    for card in faculty_cards:
        # Find all 'a' tags within the current 'div' element
        faculty_links = card.find_all('a', href=True)
        href_list.extend([base + link['href'] for link in faculty_links])

    for link in href_list:
        response = requests.get(link)
        soup = bs(response.content, 'html.parser')

        # faculty_image = base + soup.find(
        #     'img', class_='mr-sm-4 img-fluid w-100')['src']
        # faculty_name = soup.find('p', class_='person-name').text.strip()
        # faculty_study = soup.find('p', class_='block-para-bold').text.strip()
        # faculty_phoneNo = soup.find(
        #     'p', class_='section-para').text.strip()
        # name = faculty_name.split()
        # email = ""

        # if (len(name) >= 2):
        #     firstName = name[0].lower()
        #     lastName = name[-1].lower()
        #     email = f"{firstName}.{lastName}@ahduni.edu.in"
        # faculty_email = email

        teaching_div = soup.find(
            'div', class_='card-header', string='Teaching')

        if (teaching_div):
            card_body = teaching_div.find_next('div', class_='card-body')
            desired_text = card_body.get_text(strip=True)
            print(desired_text)
    # print(href_list)

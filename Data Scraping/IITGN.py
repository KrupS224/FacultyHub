import requests
from bs4 import BeautifulSoup as bs
import pandas as pd

url = 'https://iitgn.ac.in/faculty'
response = requests.get(url)

# page = "https://www.daiict.ac.in/"

faculty_list = []

if response.status_code == 200:
    soup = bs(response.content, 'html.parser')
    with open("iitgn.html", "w", encoding='utf-8') as file:
        file.write(str(soup))
    with open("iitgn.html", "r", encoding='utf-8') as file:
        html_content = file.read()

    soup = bs(html_content, "html.parser")
    facultyCards = soup.find_all(
        'div', class_='card card-2 modal-instance text-center')
    # print(len(facultyCards))
    cnt = 1
    for faculty in facultyCards:
        link = faculty.find('a')['href']
        newResponse = requests.get(link)
        new_page_soup = bs(newResponse.content, "html.parser")
        # print(new_page_soup)
        # Extract data
        faculty_name = new_page_soup.find('h2').text

        job_info = new_page_soup.find(
            'div', class_='text-block').find('span').text.strip()
        job_items = [item.strip()
                     for item in job_info.split(',')][:2]
        job_items += [None] * (2 - len(job_items))
        job_title, department = job_items

        specific_p = new_page_soup.find(
            'p', {'style': 'line-height: 0.7;', "class": 'lead'})
        next_ul = specific_p.find_next('ul') if specific_p else None
        li_elements = next_ul.find_all('li')
        information = [li.text.strip()
                       for li in li_elements] if li_elements else None
        faculty_education = '; '.join(information) if information else None

        email_element = new_page_soup.find('b', string='Email')
        faculty_email = email_element.find_parent(
            'p').get_text(strip=True).split(":  ", 1)[1] if email_element else None

        website_element = new_page_soup.find('b', string=' Website')
        faculty_website = website_element.find_next(
            'a')['href'] if website_element else None

        office_element = new_page_soup.find('b', string='Office: ')
        faculty_office = office_element.find_parent(
            'p').get_text(strip=True).split(":", 1)[1] if office_element else None

        element_list = new_page_soup.find(
            'div', class_='tabs-container').find('ul', class_='tabs').find_all('p', class_='lead')
        publication_element = element_list[0].find_all(
            'li') if len(element_list) > 0 else None
        faculty_publications = [p.text.strip()
                                for p in publication_element] if publication_element else None

        work_exp_element = element_list[1].find_all(
            'li') if len(element_list) > 1 else None
        faculty_experience = [p.text.strip()
                              for p in work_exp_element] if work_exp_element else None

        faculty_img = new_page_soup.find('img', class_='border--round')['src']
        # print(faculty_img)

        faculty = {
            'name': faculty_name,
            'job_title': job_title,
            'department': department,
            'education': faculty_education,
            'email': faculty_email,
            'website': faculty_website,
            'office': faculty_office,
            'publications': faculty_publications,
            'experience': faculty_experience,
            'image': faculty_img,
        }

        faculty_list.append(faculty)

        # print(faculty)
        print(cnt, ":", faculty['name'])
        cnt += 1
else:
    print("Failed to load page")

df = pd.DataFrame(faculty_list)
df.to_csv('data/iitgn.csv', index=False)

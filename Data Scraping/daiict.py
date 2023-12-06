import requests
from bs4 import BeautifulSoup as bs
import pandas as pd

url = "https://www.daiict.ac.in/faculty/"
page = "https://www.daiict.ac.in/"

faculty_list = []

response = requests.get(url)

if response.status_code == 200:
    soup = bs(response.content, 'html.parser')
    facultyCards = soup.find_all('div', class_='facultyDetails')

    for faculty in facultyCards:
        link = page + faculty.find('a')['href']

        if link:
            newResponse = requests.get(link)

            if newResponse.status_code == 200:
                new_page_soup = bs(newResponse.content, "html.parser")

                # Extract data
                faculty_name = faculty.find('a')['data']
                faculty_education = new_page_soup.find(
                    'div', class_='facultyEducation')
                faculty_number = new_page_soup.find(
                    'span', class_='facultyNumber')
                faculty_address = new_page_soup.find(
                    'span', class_='facultyAddress')
                faculty_email = new_page_soup.find(
                    'span', class_='facultyemail')
                faculty_website = new_page_soup.find(
                    'span', class_='facultyweb')
                faculty_biography = new_page_soup.find(
                    'div', id='tab-1')
                faculty_specialization = new_page_soup.find(
                    'div', id='tab-2')
                faculty_publications = new_page_soup.find(
                    'div', id='tab-3')
                faculty_teachings = new_page_soup.find(
                    'div', id='tab-4')
                img_src = new_page_soup.find(
                    'div', class_='facultyPhoto').find('img')['src']
                img_url = page + img_src
                faculty_photo = img_url

                faculty = {
                    "Name": faculty_name if faculty_name else '',
                    "Education": faculty_education.text if faculty_education else '',
                    "Number": faculty_number.text if faculty_number else '',
                    "Address": faculty_address.text if faculty_address else '',
                    "Email": faculty_email.text if faculty_email else '',
                    "Website": faculty_website.text if faculty_website else '',
                    "Biography": faculty_biography.text if faculty_biography else '',
                    "Specialization": faculty_specialization.text.strip() if faculty_specialization else '',
                    "Publications": faculty_publications.text if faculty_publications else '',
                    "Teachings": faculty_teachings.text.strip() if faculty_teachings else '',
                    "Image": faculty_photo if faculty_photo else ''
                }

                faculty_list.append(faculty)

                # with open('faculty_photo.jpg', 'wb') as file:
                #     file.write(faculty_photo)

            else:
                print("Failed to access link: ", link)
        else:
            print("Link not found")
else:
    print("Failed to access main page")

# Create a DataFrame from the list of dictionaries
df = pd.DataFrame(faculty_list)

# Save the DataFrame to a CSV file
df.to_csv('data/daiict2.csv', index=False)

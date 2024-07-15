import requests
from bs4 import BeautifulSoup
import pandas as pd

def fetch_html(url):
    try:
        response = requests.get(url)
        response.raise_for_status() 
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

    finally:
        print("All are fine!");
def parse_html(html_content):
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        return soup
    except Exception as e:
        print(f"Error parsing HTML: {e}")
        return None

def extract_text(soup):
    try:
        text = soup.get_text(separator=' ', strip=True)
        return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

def save_text(text, filename):
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(text)
        print(f"Text data saved to {filename}")
    except Exception as e:
        print(f"Error saving text: {e}")

def main():
    url = 'https://edomainall.web.app'
    html_content = fetch_html(url)
    
    if html_content:
        soup = parse_html(html_content)
        if soup:
            text = extract_text(soup)
            if text:
                save_text(text, 'output.txt')

if __name__ == '__main__':
    main()

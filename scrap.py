import requests
from bs4 import BeautifulSoup
from confluent_kafka import Producer
import json
import time

# Configuration du producteur Kafka
producer_config = {
    'bootstrap.servers': 'localhost:9092',  # Adresse du cluster Kafka
    'client.id': 'scrappeur',
}

# Création d'une instance du producteur
producer = Producer(producer_config)

# Sujet Kafka auquel vous souhaitez envoyer un message
sujet = 'kafkaSender'

url = "https://coinmarketcap.com"

while(True):
    # Envoyer une requête GET pour obtenir le contenu de la page
    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    response = requests.get(url, headers=headers)
    # response = requests.get(url)

    # Vérifier si la requête a réussi
    if response.status_code == 200:
        print('HTTP 200')

        cryptoDatas = []
        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find('table', {'data-coin-index-target': 'table'})
        body = soup.find('tbody')
        items = body.find_all('tr')
        for item in items:

            values = []
            tds = item.find_all('td')
            for td in tds:
                name_element = td.find('p', {'data-sensors-click':'true'})
                if name_element:
                    name_text = name_element.text.strip()
                    values.append(name_text)

                span_element = td.find('span') if td else None
                if span_element:
                    span_text = span_element.text.strip()
                    values.append(span_text)
                
                marketCap = td.find('span', {'data-nosnippet':'true'}) if td else None
                if marketCap:
                    market_text = marketCap.text.strip()
                    values.append(market_text)
            
                img_element = td.find('img') if td else None
                if img_element:
                    values.append(img_element.get('src'))

            cryptoDatas.append(values)


        json_data = json.dumps(cryptoDatas)

        # Fonction de rappel appelée une fois que le message est effectivement envoyé
        def sendData(err, msg):
            if err is not None:
                print('Échec d\'envoi du message : {0}'.format(err))
            else:
                print("sending")

        # Envoi du message au sujet Kafka
        producer.produce(sujet, key=None, value=json_data, callback=sendData)

        # Attendez que les messages soient effectivement envoyés et confirmés
        producer.flush()
        time.sleep(5)
    else:
        print("La requête a échoué. Code de statut :", response.status_code)

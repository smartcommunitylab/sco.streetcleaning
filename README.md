# Street Cleaning Project

## Requirements

- Java 17
- MongoDB 4.2+

## Data Sources

- inputdata/calendar (https://www.comune.trento.it/Aree-tematiche/Open-Data/Tipologie-di-dati/Tutti-gli-open-data/Pulizia-strade-e-relativi-divieti-di-sosta-autunno-2020)
- spazzamento.kml (https://www.comune.trento.it/Aree-tematiche/Cartografia/Download/Grafo-stradale-vie-soggette-a-pulizia-strade) 

## Java Build / Run 

Build with Maven:
``
mvn clean package -Dmaven.test.skip=true
``

Run standalone Java app:
``
java -jar target/streetcleaning-1.0.0.jar
``
The server is started and listening on port 8080

## Docker

Build image 

``docker build -t smartcommunitylab/streetcleaning Dockerfile . ``

Run image 

``docker run -p 8080:8080 smartcommunitylab/streetcleaning``

Docker compose 

``docker-compose up``

## Environment Variables
- `DATASOURCE_URL`  MongoDB datasource URL
- `STREETCLEANING_KMLFILE` URL of the KML file of the streets
- `STREETCLEANING_CALFILE` URL of the calendar csv file
- `STREETCLEANING_UPDATEFILES` Whether to update the data on startup (defaults to true)
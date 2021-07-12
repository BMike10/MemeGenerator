# Exam #1234: "Generatore di meme"
## Student: s123456 BASILICO MICHELE 

## React Client Application Routes

- Route `/`: 
  Route per la visualizzazione dei meme pubblici visibili a qualsiasi utente non loggato
- Route `/login`: 
  Route per la compilazione del form di login per utenti non loggati
- Route `/home`: 
  Route per la visualizzazione dei meme pubblici e protetti a utenti creatori loggati in precedenza.
  Da questa route è inoltre possibile creare nuovi meme e copiare meme già a disposizione sul sito
- Route `/home/copyMeme`:
  Route fittizzia per la copia di un nuovo meme, in realtà non è una nuova pagina ma si tratta della stessa route home con il modale sempre aperto
  Questo route permette di passare uno stato già presente e di usarlo come localizzazione, in maniera tale da avere i parametri del meme
  che stiamo cercando di copiare

## API Server


### Meme Management
- POST `/api/login`
  - request parameters and request body content
  - response body content

#### Get all meme

* HTTP method: `GET`  URL: `/api/meme`
* Description: Get the full list of meme, belong to the logged user and not. 
  The meme also includes all information relating to the sentences that it contains 
* Request body: _None_
* Request query parameter: _None_
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one task:

``` JSON
[{"id":1,"title":"Meme1","visibility":1,"color":"dark","font":"font2","templateId":1,"creator":{"id":1,"username":"Michele"},"sentences":[{"id":1,"text":"Studiare tutta la settimana per poi consegnare e non cominciare di nuovo tutto da capo","position":""},{"id":2,"text":"Studiare tutta la settimana per poi non consegnare e perdere tutto il lavoro","position":""}]},{"id":2,"title":"Meme2","visibility":1,"color":"dark","font":"font1","templateId":2,"creator":{"id":2,"username":"Carlo"},"sentences":[{"id":3,"text":"Vieira: L'Italia non andrà avanti","position":""}]},{"id":3,"title":"Meme3","visibility":0,"color":"dark","font":"font2","templateId":3,"creator":{"id":2,"username":"Carlo"},"sentences":[{"id":4,"text":"Ingegneri vs Ingegneri","position":""},{"id":5,"text":"Ingegneri vs Architetti","position":""},{"id":6,"text":"Ingegneri vs Gestionali","position":""}]}]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get public meme

* HTTP method: `GET`  URL: `/api/meme/publicMeme`
* Description: Get a list of meme, belong to the logged user and not, with the _public_ attribute set as false. 
  The meme also includes all information relating to the sentences that it contains 
* Request body: _None_
* Request query parameter: _None_
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one task:

``` JSON
[{"id":1,"title":"Meme1","visibility":1,"color":"dark","font":"font2","templateId":1,"creator":{"id":1,"username":"Michele"},"sentences":[{"id":1,"text":"Studiare tutta la settimana per poi consegnare e non cominciare di nuovo tutto da capo","position":""},{"id":2,"text":"Studiare tutta la settimana per poi non consegnare e perdere tutto il lavoro","position":""}]},{"id":2,"title":"Meme2","visibility":1,"color":"dark","font":"font1","templateId":2,"creator":{"id":2,"username":"Carlo"},"sentences":[{"id":3,"text":"Vieira: L'Italia non andrà avanti","position":""}]}]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get all meme

* HTTP method: `GET`  URL: `/api/meme`
* Description: Get the full list of meme, belong to the logged user and not. 
  The meme also includes all information relating to the sentences that it contains 
* Request body: _None_
* Request query parameter: _None_
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one task:

``` JSON
[{"id":1,"title":"Meme1","visibility":1,"color":"dark","font":"font2","templateId":1,"creator":{"id":1,"username":"Michele"},"sentences":[{"id":1,"text":"Studiare tutta la settimana per poi consegnare e non cominciare di nuovo tutto da capo","position":""},{"id":2,"text":"Studiare tutta la settimana per poi non consegnare e perdere tutto il lavoro","position":""}]},{"id":2,"title":"Meme2","visibility":1,"color":"dark","font":"font1","templateId":2,"creator":{"id":2,"username":"Carlo"},"sentences":[{"id":3,"text":"Vieira: L'Italia non andrà avanti","position":""}]},{"id":3,"title":"Meme3","visibility":0,"color":"dark","font":"font2","templateId":3,"creator":{"id":2,"username":"Carlo"},"sentences":[{"id":4,"text":"Ingegneri vs Ingegneri","position":""},{"id":5,"text":"Ingegneri vs Architetti","position":""},{"id":6,"text":"Ingegneri vs Gestionali","position":""}]}]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get public meme

* HTTP method: `GET`  URL: `/api/meme/publicMeme`
* Description: Get a list of meme, belong to the logged user and not, with the _public_ attribute set as false. 
  The meme also includes all information relating to the sentences that it contains 
* Request body: _None_
* Request query parameter: _None_
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one task:

``` JSON
[{"id":1,"title":"Meme1","visibility":1,"color":"dark","font":"font2","templateId":1,"creator":{"id":1,"username":"Michele"},"sentences":[{"id":1,"text":"Studiare tutta la settimana per poi consegnare e non cominciare di nuovo tutto da capo","position":""},{"id":2,"text":"Studiare tutta la settimana per poi non consegnare e perdere tutto il lavoro","position":""}]},{"id":2,"title":"Meme2","visibility":1,"color":"dark","font":"font1","templateId":2,"creator":{"id":2,"username":"Carlo"},"sentences":[{"id":3,"text":"Vieira: L'Italia non andrà avanti","position":""}]}]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get meme template

* HTTP method: `GET`  URL: `/api/memeTemplate`
* Description: Get a list of memeTemplate available on the web-site that contains information about sentences position and img path. 
* Request body: _None_
* Request query parameter: _None_
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one task:

``` JSON
[{"id":1,"nome":"Drake","img":"drake.png","sentences":[{"id":1,"text":"","position":"top_rigth_2texts"},{"id":2,"text":"","position":"bottom_right_2texts"}]},{"id":2,"nome":"Pacha","img":"pacha-meme.jpg","sentences":[{"id":3,"text":"","position":"center_bottom"}]},{"id":3,"nome":"Spongebob","img":"spongebob1.jpg","sentences":[{"id":4,"text":"","position":"top_rigth_3texts"},{"id":5,"text":"","position":"center_rigth_3texts"},{"id":6,"text":"","position":"bottom_rigth_3texts"}]},{"id":4,"nome":"Dragons","img":"dragons.jpg","sentences":[{"id":7,"text":"","position":"bottom_left_3texts_2"},{"id":8,"text":"","position":"bottom_center_3texts_2"},{"id":9,"text":"","position":"bottom_rigth_3texts_2"}]},{"id":5,"nome":"Spongebob2","img":"spongebob2.png","sentences":[{"id":10,"text":"","position":"center_bottom"}]},{"id":6,"nome":"OldMan","img":"old_man.png","sentences":[{"id":11,"text":"","position":"bottom_center_2texts"},{"id":12,"text":"","position":"center_2texts"}]}]
```

* Error responses:  `500 Internal Server Error` (generic error)


### Add a new meme

* HTTP method: `POST`  URL: `/api/meme`
* Description: Add a new meme to the meme of the logged user and on the portal
* Request body: description of the object to add (creator propery is ignored and substituted with the id of the logged user, meme id value is not required and is ignored)

``` JSON
{"title":"Inghilterra","img":"spongebob2.png","font":"font1","color":"primary","visibility":0,"creatorId":1,"templateId":5,"sentences":[{"text":"It's CoMIng HooOme11!!","sentencesTemplateId":10}]}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database

* Error responses:  `422 Unprocessable Entity` (values do not satisfy validators), `503 Service Unavailable` (database error)


### Delete an existing meme

* HTTP method: `DELETE`  URL: `/api/meme/:id`
* Description: Delete an existing meme of the logged user
* Request body: _None_

* Response: `200 OK` (success)
* Response body: an empty object

* Error responses:  `500 Internal Server Error` (generic error)

### User Management

#### Login

* HTTP method: `POST`  URL: `/api/sessions`
* Description: authenticate the user who is trying to login
* Request body: credentials of the user who is trying to login

``` JSON
{
    "username": "username",
    "password": "password"
}
```

* Response: `200 OK` (success)
* Response body: authenticated user

``` JSON
{
    "id": 1,
    "username": "john.doe@polito.it", 
    "name": "John"
}
```
* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)


#### Check if user is logged in

* HTTP method: `GET`  URL: `/api/sessions/current`
* Description: check if current user is logged in and get her data
* Request body: _None_
* Response: `200 OK` (success)

* Response body: authenticated user

``` JSON
{
    "id": 1,
    "username": "john.doe@polito.it", 
    "name": "John"
}
```

* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)


#### Logout

* HTTP method: `DELETE`  URL: `/api/sessions/current`
* Description: logout current user
* Request body: _None_
* Response: `200 OK` (success)

* Response body: _None_

* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
## Database Tables

- Table `Creators` - contains id username password
- Table `Meme` - contains id title font color visibility templateId creatorId
- Table `MemeTemplate` - contains id nome img
- Table `SentencesMeme` - contains id text memeId sentencesTemplateId
- Table `SentencesTemplate` - contains id templateId position

## Main React Components

- `MemeList` (in `MemeList.js`): component purpose and main functionality
- `MemeCard` (in `MemeList.js`): component purpose and main functionality
- `MemeSelectedModal` (in `MemeList.js`): component purpose and main functionality
- `NewMemeModal` (in `MemeList.js`): component purpose and main functionality
- `CopyMemeModal` (in `MemeList.js`): component purpose and main functionality
- `LoginForm` (in `Login.js`): component purpose and main functionality
- `LogoutButton` (in `Login.js`): component purpose and main functionality
- `LoginButton` (in `Login.js`): component purpose and main functionality
- `MyNavBar` (in `MyNavBar.js`): component purpose and main functionality

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

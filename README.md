# Exam #1234: "Generatore di meme"
## Student: s123456 BASILICO MICHELE 

## React Client Application Routes

- Route `/`: 
  Route for displaying public memes visible to any non-logged in user. From this page you can only scroll through the list and view the selected meme in detail.
  It is the default route of the website, to which the user is sent back if he is not logged in or if he logs out..  

- Route `/login`: 
  Route for filling in the login form for non-logged in users.  

- Route `/home`: 
  Route for displaying public and protected memes to previously logged in creators.
  From this route it is also possible to create new memes and copy memes already available on the site
  The page can be divided into two sections. The first section allows you to view the public and private memes of other creators, and also to make a copy of them. The second section presents only the memes of the logged in user. From here, in addition to the previous ones, the function for deleting your memes is also available.

- Route `/home/copyMeme`:
  Route for copying a new meme.
  It is not a new page but it is the same home route with the modal always open.
  This route allows you to pass an already present state and use it as a localization, in such a way as to have the parameters of the starting meme selected to be copied.
  


## API Server
### Meme Management

#### Get all meme

* HTTP method: `GET`  URL: `/api/meme`
* Description: Get the full list of meme, belong to the logged user and not. 
  The meme also includes all information relating to the sentences that it contains. 
* Request body: _None_
* Request query parameter: _None_
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one task:

``` JSON
[{"id":1,"title":"Meme1","public":1,"color":"dark-Black","font":"font2","templateId":1,"creator":{"id":1,"username":"Michele"},"sentences":[{"id":1,"text":"Studiare tutta la settimana per poi consegnare e non cominciare di nuovo tutto da capo","position":""},{"id":2,"text":"Studiare tutta la settimana per poi non consegnare e perdere tutto il lavoro","position":""}]},{"id":2,"title":"Meme2","public":1,"color":"dark-Black","font":"font1","templateId":2,"creator":{"id":2,"username":"Carlo"},"sentences":[{"id":3,"text":"Vieira: L'Italia non andrà avanti","position":""}]},{"id":3,"title":"Meme3","public":0,"color":"dark-Black","font":"font2","templateId":3,"creator":{"id":2,"username":"Carlo"},"sentences":[{"id":4,"text":"Ingegneri vs Ingegneri","position":""},{"id":5,"text":"Ingegneri vs Architetti","position":""},{"id":6,"text":"Ingegneri vs Gestionali","position":""}]}]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get public meme

* HTTP method: `GET`  URL: `/api/meme/publicMeme`
* Description: Get a list of meme, belong to the logged user and not, with the _public_ attribute set as false(0). 
  The meme also includes all information relating to the sentences that it contains 
* Request body: _None_
* Request query parameter: _None_
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one task:

``` JSON
[{"id":1,"title":"Meme1","public":1,"color":"dark-Black","font":"font2","templateId":1,"creator":{"id":1,"username":"Michele"},"sentences":[{"id":1,"text":"Studiare tutta la settimana per poi consegnare e non cominciare di nuovo tutto da capo","position":""},{"id":2,"text":"Studiare tutta la settimana per poi non consegnare e perdere tutto il lavoro","position":""}]},{"id":2,"title":"Meme2","public":1,"color":"dark-Black","font":"font1","templateId":2,"creator":{"id":2,"username":"Carlo"},"sentences":[{"id":3,"text":"Vieira: L'Italia non andrà avanti","position":""}]}]
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
{"title":"Inghilterra","img":"spongebob2.png","font":"font1","color":"primary","public":0,"creatorId":1,"templateId":5,"sentences":[{"text":"It's CoMIng HooOme11!!","sentencesTemplateId":10}]}
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
- Table `Meme` - contains id title font color public templateId creatorId
- Table `MemeTemplate` - contains id nome img
- Table `SentencesMeme` - contains id text memeId sentencesTemplateId
- Table `SentencesTemplate` - contains id templateId position

## Main React Components

- `MemeList` (in `MemeList.js`): Contains a list of cards representing the entire meme list.
Inside there are two modes, both not visible by default. _MemeSelectedModal_ is open when from the list, a user chooses to view a meme in detail, while _NewMemeModal_ is open when the user chooses to create a new meme (through the appropriate card or the relative contains a list of cards representing the entire meme list.


- `MemeCard` (in `MemeList.js`): Structure of the card containing the main attributes of a meme including creator, image and texts.
The card changes color when it is being created or deleted.
Inside there are different buttons depending on whether it is a logged in user and not logged in.
The logged in user has in fact, for example, the possibility of copying it as well as viewing it.
Likewise, depending on whether the logged in user, whether or not he is the creator of a certain meme, has the option to delete it.

- `MemeSelectedModal` (in `MemeList.js`): modal that allows the display of the main characteristics of the meme, ie title, creator, image and finally the texts.

- `NewMemeModal` (in `MemeList.js`): modal that allows the creation of a new meme through a form, choosing the new title, of maximum 100 characters and which is mandatory, a basic template, texts (at least one is mandatory), and finally the choice on whether to render or not I publish the meme.

- `CopyMemeModal` (in `MemeList.js`): modal that allows the copying through a form of a new meme, choosing the new title, of maximum 100 characters and which is mandatory, a basic template, texts (at least one is mandatory), and finally the choice on whether to render or not I publish the meme.
Copying differs from simple creation especially as regards the fact that the fields are already preset and that it is not possible to change the basic template.
Finally, there are some differences regarding the ability to change the public attribute, which turns out to be disabled when you are not the creator of a private meme.

- `LoginForm` (in `Login.js`): Form that allows the user to login through a username and password present in the db.
The entire request procedure is entrusted to the external library bcrypt.

- `LogoutButton` (in `Login.js`): Button that allows you to log out. It is present in the navbar only from the moment in which a user is already authenticated.

- `LoginButton` (in `Login.js`): Button that allows you to log in. Redirects to the login route. Present only in the moment in which the user is not yet authenticated.

- `MyNavBar` (in `MyNavBar.js`): Navigation bar containing title, logo and finally the login and logout buttons.


## Screenshot

![Screenshot](./img_README/home(noLogged).png)
![Screenshot](./img_READMEhome_selectedMeme(noLogged).png)
![Screenshot](./img_README/home1(Logged).PNG)
![Screenshot](./img_README/home2(Logged).PNG)
![Screenshot](./img_README/homeCreate1(Logged).png)
![Screenshot](./img_README/homeCreate2(Logged).png)


## Users Credentials

- Username: Carlo, Password: Gattini35 (plus any other requested info)
- Username: Michele, Password: student (plus any other requested info)
- Username: Martina, Password: Cereali82 (plus any other requested info)

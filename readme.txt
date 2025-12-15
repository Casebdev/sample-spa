Simple Single Page Application (SPA)
====================================
System Prerequisits
-------------------
The follwing must be installed on the local computer

1 - node.js
2 - mysql server


Initialization
--------------
One the repository has been cloned or copied the following must be performed

1 - install the node libraries. Move to the server folder where package.json file is location and execute

   npm install
   
This will create the node_modules folder will all of the required node libraries

2 - set mySql credentials. Edit the sspa.js file and set the values for sspaDb.user and sspaDb.password

   //mysql database information - enter your information here
   sspaDb.host='127.0.0.1';
   sspaDb.database='sspa';
   sspaDb.user='XXXXX';
   sspaDb.password='XXXXX';

If the mySql server is running on a computer other than the local computer then also set sspaDb.host 

3 - start the sspa server. Move to the \server folder and execute

   node sspa-server.js
   
This will start the http server listening on port 3003


4 - start the application. From a browser execute

   http: localhost:3000
   
   or
   
   http: 127.0.0.1:3003
   
This will send an http get request for the \ route on the server which will download the HTML for the sample single page application



Knowledge Prerequisites
-----------------------
Development of a single page web application is predicated on an underatanding of many things. The following is a summary of these requirements.


General
-------
HTTP: This is the HyperText Transport Protocol. This is the information that is exchanged between a Browser and an HTTP Server. The browser provides 
a user interface (keyboard, mouse, screen, etc) and renders the information on the display. The HTTP server takes requests from the browser and responds 
with HTML web pages and other data. A very good basic understanding of these concepts is required to understand the development of the SPA, especially
the concepts of HTTP GET and HTTP POST communications as well as AJAX (XMLHttpRequest) communications.

See: https://nodejs.org/en/learn/http/anatomy-of-an-http-transaction


Client Side
-----------
This makes use of the browser environment with various libraries. Key elements are as follows

Document Object Model (DOM):  This is the browsers representation of the HTML page that has been loaded. Must have an in depth understanding of the structure and
how to manipulate the DOM. This is key to creating a Single Page Application.

HTML: The files that are used to generate content for display on a web browser. This is represnted internally by the browser as the DOM and is available for manipulation.

CSS: The files that are used to control the styling of the HTML pages. This information is also represnted internally by the browser within the DOM and is avaiable for manipulation.

Javascript: The programming language of the browser. This allows the DOM to be manipulated. There are many libraries provided by te browser to manipulate the DOM and other features.
 

Server Side
-----------
This makes use of the node.js environment with a number of key libraries to implement an HTTP server. 

See: https://www.w3tutorials.net/blog/how-does-nodejs-create-http-servers/

Node.js: What does it mean to make use of node.js as an environment? Most important is that code is developed in Javascript and Node.js providesd an interface to 
the resources of the server. The second most prominent feature is that code is executed in a single thread and it makes extensive use of asynchronous code 
development model - this can be implemented with native Javascript 'async/await' statements or with Javascript 'promises' or you can make use of callback
functions (with an appropriate helper library such as 'async' - to avoid callback hell!!). Regardless of the model chosen you REALLY need to understand 
the intacacies of asyncronous code development. 

Javascript: The programming language of the Node.js environment. Many third party libraries are available to accomplish almost any task.

NPM: This is the package manager for Node.js. An extensive knowledge is not required but a good basic understanding will go a LONG WAY!

ASYNC Library: For the sample SPA HTTP server we make use of callbacks and the ASYNC librabry of helper functions - specifically the async.waterfall() construct.

Express Library: This is a node.js library to create an HTTP server. Will need a strong understanding of this to implement the server.

Handlebars Library: This is a node.js library to allow creation of HTML pages from templates. Need a good basic understanding  



Folder Structure
-----------------
  \    Root directory of the Sample SPA system 
  |
  |
  |-- \views     web pages - handlebars format (HTML)
  |      |
  |	     |
  |      |-- \layouts    User interface handlebars layout files
  |       
  |
  |-- \public
  |      |
  |      |
  |      |-- \css     User interface CSS files
  |      |
  |      |
  |      |-- \src     User interface source code 
  |      |
  |      |
  |      |-- \img     User interface static image files
  |      
  |      
  |-- \server   Server code
         |
         |
		 |-- \node_modules   Node js modules for the server



Files
-----
\readme.txt - general information on the SSPA application
\sspa-changelog.txt - development history log of the SSPA application

views\sspa.handlebars - body HTML returned by the server for the HTTP GET \ - this is the main page for the SPA
views\health.handlebars - body HTML returned by the server for the HTTP GET request to \health - this is used by some hosts to determine that an application is alive
views\500.handlbars - body HTML returned by the HTTP server if there is an internal error to a request
views\404.handlebars - body HTML returned by the server for a non-existant URL resource request
views\layouts\main.handlebars - the default layout for each of the HTML pages

public\src\sspa.js - browser side application javascript
public\src\jquery-3.2.1.min.js - browser side jQuery library
public\css\sspa.css - browser side CSS for styling the HTML
public\img\sampleSpa.png - image file for the application icon

server\sspa-server.js - server side application javascript
server\package.json - NPM application information file and dependancies 
server\database-structure.txt - information on the database used by the application


MySQL Database Structure
------------------------
See the file server\database-structure.txt for details


Server Executable
-----------------
sspa.js - node js SPA server application code
package.json - application manifest











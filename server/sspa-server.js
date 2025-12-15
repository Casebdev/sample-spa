// *****************************************************************************************************
// Application: Sample Single Page Application Template Server
//
// Handles all backend functions of the sample SPA.
//
// *****************************************************************************************************

//libraries needed
var path=require('path');
var mysql=require('mysql');
var express=require('express');
var app=express();
var async=require('async');
var bodyParser=require('body-parser');
var handlebars=require('express-handlebars').create({ defaultLayout: 'main' });
var server=require('http').Server(app);

//global variables
var sspaDb={};			//database access information

//version information
const SW_VERSION = '1.1.0';

//error system constants
const ERR_OK = 0;
const ERR_ERROR = 1;
const ERR_WARN = 2;
const ERR_COMMENT = 3;
const ERR_SYSTEM = 4;

//Server API errors
var errExample=makeErr(ERR_ERROR,'SPA-EXAMPLE','This is an example API error');

//mysql database information - enter your information here
sspaDb.host='127.0.0.1';
sspaDb.database='sspa';
sspaDb.user='mark';
sspaDb.password='mark';

// *****************************************************************************
// Initializaion sequence
//
// ***************************************************************************** 
//server startup banner
console.log(" ");
console.log("Sample Single Page Application System");
console.log("-------------------------------------");
console.log("Version v"+SW_VERSION);
console.log("Database Host: "+sspaDb.host);


// *****************************************************************************
// Build the HTTP Server
//
// Created with express and handlebars
//
// Built using middleware, API specific middleware, static content serving, 
// get routes and API post routes.
//
// Once everything is built the server is started on port 3003.
//
// *****************************************************************************

//configure the express system to use handlebars as the methoid for generating HTML pages from templates 

app.engine('handlebars', handlebars.engine);
app.set('views', '../views');
app.set('view engine', 'handlebars');

//consifure the HTTP server to listen on port 3003 rather than the standard port 80
app.set('port', 3003);

//middleware parsers for processing the HTTP request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.text());

//middleware processing to allow HTTP server to serve up static content from the ./public folder of the application distribution
app.use(express.static(path.join(__dirname,'../public')));


// *****************************************************************************
// route-handler: "/" (get)
//
// This will render the initial page of the site using handlebars infrastructure
//
// *****************************************************************************
app.get('/', function (req, res) 
   {
   var src;

   res.render('sspa',{version:SW_VERSION});
   });


// *****************************************************************************
// route-handler: "/health" (get)
//
// This will render the 'health' page of the site using handlebars infrastructure
//
// *****************************************************************************
app.get('/health', function (req, res) 
   {
   var src;
   res.render('health',{version:SW_VERSION});
   });


// ******************************************************************************
// API routes
// 
// These are routes related to the API section of  the application. These Return
// items of information to the main part of the single page Application
//
// The order that the routes and middlewares are added is imporatant in this
// sequence of apiRoutes.
//
// Add the API middleware handlers first, then the various API routes
//
// ******************************************************************************

apiRoutes=express.Router();

// *****************************************************************************
//
// Middleware: 
//
// These are execute for every API route. This can be used to make checks 
// before continuing to process the route.
//
// This shows a single middle ware processing routine that does nothing
//
// *****************************************************************************
apiRoutes.use(function(req,res,next) 
   {
   var resp={};
 
   //put things to do here
   
   //next route processing
   next();
   return;

   //can terminate API route processing if needed
   err=errSomeError;
   resStatus(err,resp);
   res.json(JSON.stringify(resp));   
   });


// ******************************************************************************
// route-handler: "/get-info" (post)
//
// An example showing how to return some information. 
//
// This specific example returns information from the info table of the database.
//
// Input
//
//   none
//
// Return
//
//   dbhost: string - the address of the mySql Host
//   dbdatabase: string - the name of the database
//   dbuser: string - the user name for access creds 
//   res: array of objects - results from the query
//   dbError: number - indicates success or failure
//   dbErrCode: string - error description
//   dbErrMsg: string - error message
//
// ******************************************************************************
apiRoutes.post('/get-info', function(req,res) 
   {
   var resp={};
   var db;
   
   //response - the information on the database configuration
   resp.dbhost=sspaDb.host;
   resp.dbdatabase=sspaDb.database;
   resp.dbuser=sspaDb.user;

   async.waterfall([
   
      //get the user information
      function(callback)
         {
	     //sql to query rows from the table	
         q="select * from info;";
         connectQuery(db,sspaDb,q,function(err,results,fields)
            {
			resp.res=[];	
            if(!err)
               {
               if(results.length!=0) resp.res=results;
               };

            callback(err);
            });
         }],

      //err and final
      function(err)
         {         
		 resStatus(err,resp);
         res.json(JSON.stringify(resp));
         });
   });
   
   
// ******************************************************************************
// route-handler: "/get-records"
//
// An example showing how to return a set of records from a database table. 
//
// Input
//
//   param1: int - example parameter
//   param2: int - example paramater
//
// Return
//
//   res: array of objects - array results from the db query
//   dbError: number - indicates success or failure
//   dbErrCode: string - error description
//   dbErrMsg: string - error message
//
// ******************************************************************************
apiRoutes.post('/get-records', function(req,res) 
   {
   var resp={};
   var db;
   var p;
   
   //data from headers
   p=req.body.inp;
   
   //process the input paramaters - in this example just reflect them back to the client
   resp.p1=p.param1;
   resp.p2=p.param2;
   
   async.waterfall([
   
      //get the records
      function(callback)
         {
	     //sql to query rows from the table		 
         q="select * from records;";
         connectQuery(db,sspaDb,q,function(err,results,fields)
            {
			resp.res=[];	
            if(!err)
               {
               if(results.length!=0) resp.res=results;
               };

            callback(err);
            });
         }],

      //err and final
      function(err)
         {         		 
		 resStatus(err,resp);
         res.json(JSON.stringify(resp));
         });
   });  


// ******************************************************************************
// route-handler: "/set-records"
//
// An example showing how to write a record to the database table. 
//
// Input
//
//   inp.val1: int - table val1 value
//   inp.val2: int - table val2 value
//   inp.val3: string - table val3 value
//
// Return
//
//   dbError: number - indicates success or failure
//   dbErrCode: string - error description
//   dbErrMsg: string - error message
//
// ******************************************************************************
apiRoutes.post('/set-records', function(req,res) 
   {
   var resp={};
   var db;
   var p;
   
   //data from headers
   p=req.body.inp;
   
   async.waterfall([
   
      //get the records
      function(callback)
         {
	     //sql to insert values into the table
         q="insert into records values ("+p.val1+","+p.val2+","+esc(p.val3)+");";
         connectQuery(db,sspaDb,q,function(err,results,fields)
            {
            callback(err);
            });
         }],

      //err and final
      function(err)
         {         		 
		 resStatus(err,resp);
         res.json(JSON.stringify(resp));
         });
   }); 


// ******************************************************************************
// route-handler: /del-records
//
// An example showing how to delete records from the database table. 
//
// Input
//
//   none
//
// Return
//
//   rows: int - number of rows deleted
//   dbError: number - indicates success or failure
//   dbErrCode: string - error description
//   dbErrMsg: string - error message
//
// ******************************************************************************
apiRoutes.post('/del-records', function(req,res) 
   {
   var resp={};
   var db;
   var p;
   
   //data from headers
   p=req.body.inp;
   
   async.waterfall([
   
      //get the records
      function(callback)
         {
		 //sql to delete rows from the table	 
         q="delete from records where val1="+p.val1+" and val2="+p.val2+";";
         connectQuery(db,sspaDb,q,function(err,results,fields)
            {
		    resp.rows=0;
			if(!err) resp.rows=results.affectedRows;

            callback(err);
            });
         }],

      //err and final
      function(err)
         {         		 
		 resStatus(err,resp);
         res.json(JSON.stringify(resp));
         });
   });    

   
// *****************************************************************************
// apply the API routes to the server application
// *****************************************************************************
app.use('/api',apiRoutes);


// ******************************************************************************
// route-handler: 404 - page not found
//
// This is the default route handler since it is the last in the list
//
// ******************************************************************************
app.use(function (req, res) 
   {
   res.status(404);
   res.render('404');
   });


// ******************************************************************************
// route-handler: 500 - error
//
// This is the route handler if there is an internal server error of some kind
//
// ******************************************************************************
app.use(function (err, req, res, next) 
   {
   console.error(err.stack);
   res.status(500);
   res.render('500');
   });


// ******************************************************************************
// Server: Start the server running
//
// ******************************************************************************
server.listen(app.get('port'), function () 
   {
   console.log('HTTP Server listening on port: ' + app.get('port') + ' ...');
   });


// ******************************************************************************
// connectQuery()
//
// This opens a connection to a database, performs a query and then closes the
// connection. The call back function is called when all is completed.
//
// This is a helper function since this structure is used in many places.
//
// ******************************************************************************
function connectQuery(db,dbIn,qs,callback)
   {   
   db=mysql.createConnection(dbIn);

   db.connect(function(err) 
      {
      if(err) 
         {
         callback(err,null,null);
         db.end();
         return;
         };
      
      db.query(qs,function(error, results, fields) 
         {
         if(error) 
            callback(error,null,null);
         else
            callback(error,results,fields);

         db.end();
         });
      });
   }


// ***************************************************************************
// function: resStatus()
//
// Set the response status of a app request based on the results of
// an API call. Differetiation between underlying system level errors 
// and API errors, warnings and comments.
//
//  Input:
//
//    err - error object: fields of interest are code,message and eType
//          this can be a system generated error object or API specific
//
//  Output:
//
//  res.dbError - number:  This is the type of error from the server
//     ERR_OK = 0 - no error
//     ERR_ERROR = 1 - an error using the API
//     ERR_WARN = 2 - a warning from the API
//     ERR_COMMENT = 3 - a comment from the API
//     ERR_SYSTEM = 4 - an underlying error from the OS or from NODE JS
//
//  res.dbErrCode - string: the error code text - a short form message
//                  This is from the err.code of the input error
//  res.dbErrMsg - string: the error message - deteiled information
//                 This is from the err.message of the input error
//
// ***************************************************************************
function resStatus(err,res)
   {
   if(err==null)
      {
      res.dbError=ERR_OK;
      res.dbErrCode='Ok';
      res.dbErrMsg='Ok';
      }
   else
      {
      if(typeof(err.eType)=='undefined')
         res.dbError=ERR_SYSTEM;
      else
         res.dbError=err.eType;
  
      //for system level errors do not expose the full text of the error
      if(res.dbError==ERR_SYSTEM)
         {
         res.dbErrCode=err.code;
         res.dbErrMsg="SYSTEM: "+err.code;
         }
      else
         {
         res.dbErrCode=err.code;
         res.dbErrMsg=err.message;
         };
      };
   }
   
   
// ***************************************************************************
// function: makeErr()
//
// Makes a new server API error object. These can be used with resStatus()
// to return application level errors to the client.
//
// ***************************************************************************
function makeErr(errType,code,msg)
   {
   return {eType:errType, message:msg, code:code};
   }   


// ******************************************************************************
// function: esc
//
// Escapes a mysql user input value. This should always be used when inserting
// string items
//
// ******************************************************************************
function esc(val)
   {
   return mysql.escape(val);
   }
   
  
   






























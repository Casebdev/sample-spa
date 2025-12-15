// ********************************************************************************
// Project: Sample Single Page Application - User Interface - Main page
//
// This provides the user interface for interacting with the application
//
// *********************************************************************************


// ***************************************************************************
// Global variables
//
// ***************************************************************************
var info;


// *********************************************************************************
// Code executed immediately while the javascrpt is being loaded into the browser
//
// *********************************************************************************

// execute the application initialization once the web page has been fully loaded
window.addEventListener("load",initialize);


// *************************************************************************************************************************************
// Initialize()
//
// Application nitialization sequence. Executed once the web page has been fully loaded
//
// *************************************************************************************************************************************
function initialize()
   {
   //request basic information from the backend server about the application
   req('get-info',0,processAppInfo,errorAppInfo);
   }


// ***************************************************************************
// function: errorAppInfo()
//
// Error querying for application information
//
// ***************************************************************************
function errorAppInfo(xhr,data,status)
   {
   setInnerHTML("inforesult","Error loading application information: "+xhr.statusText);
   }
   
   
// ***************************************************************************
// function: processAppInfo()
//
// Processes initial information from the application
//
// ***************************************************************************
function processAppInfo(data,status)
   {
   var chk;
   
   //parse information returned by the server, this is in JSON format
   info=JSON.parse(data);
   
   //check for any application errors from the server API
   chk=checkError(info);
   if(chk.result==1)
      {
      setInnerHTML("inforesult","Error loading application information: "+chk.msg);		  
      }
   else
      {
      //process the information returned by the server
      //update the inner HTML of various DOM elements - this will display information on the main display of the application
	  
	  if(info.dbcreated==1)
		 setInnerHTML("inforesult","Status: Database not found - created success");
	  else
   	     setInnerHTML("inforesult","Status: Database read success");
	  
      setInnerHTML("dbhost","DB host: "+info.dbhost);
      setInnerHTML("dbdatabase","DB dbase: "+info.dbdatabase);
      setInnerHTML("dbuser","DB user: "+info.dbuser);
      setInnerHTML("appname","SPA Name: "+info.res[0].appname);
      setInnerHTML("appversion","SPA Version: "+info.res[0].appversion);
      setInnerHTML("appdate","SPA Date: "+info.res[0].appdate);
      setInnerHTML("appauthor","SPA Author: "+info.res[0].appauthor);   
	  };
   }


// ***************************************************************************
// function: clearRecords()
//
// Clear the records displayed by removing elements from the DOM
//
// ***************************************************************************
function clearRecords()
{
	
setInnerHTML("getresult","Status:");
   
//remove the old list of results from DOM if they exist
node=document.getElementById("record-area");
nl=document.getElementById("record-param");
if(nl!=null) node.removeChild(nl);  
nl=document.getElementById("record-list");
if(nl!=null) node.removeChild(nl);	
}


// ***************************************************************************
// function: delRecords()
//
// Request delete records from a database table. 
//
// ***************************************************************************
function delRecords()
{
var inp={};

setInnerHTML("delresult","Status: ");

if(getVal("inputd1")=="" || getVal("inputd2")=="")
   {
   setInnerHTML("delresult","Status: Error - All items must have a value");
   return;
   }

inp.val1=Number(getVal("inputd1"));
inp.val2=Number(getVal("inputd2"));

if(isNaN(inp.val1) || isNaN(inp.val2))
   {
   setInnerHTML("delresult","Status: Error - Val1 and Val2 must be integers");
   return;
   }

req('del-records',inp,processDelRecords,errorDelRecords);	
}


// ***************************************************************************
// function: errorDelRecords()
//
// Error deleting records
//
// ***************************************************************************
function errorDelRecords(xhr,data,status)
   {
   setInnerHTML("delresult","Status: System - "+xhr.statusText);
   }
   
   
// ***************************************************************************
// function: processDelRecords()
//
// Processes deleting of records
//
// ***************************************************************************
function processDelRecords(data,status)
   {
   var chk;
   
   //parse results returned by the server, this is in JSON format
   info=JSON.parse(data);
   
   //check for any application errors from the server API
   chk=checkError(info);
   if(chk.result==1)
      {
	  setInnerHTML("delresult","Status: "+chk.msg);
	  if(chk.critical==1) return;
      }
   else   
      {
	  setInnerHTML("delresult","Status: Database delete success - "+info.rows+" deleted");
	  setVal("inputd1","");
	  setVal("inputd2","");
	  };
   }


// ***************************************************************************
// function: setRecords()
//
// Request information from a database table. Shows an example of passing
// some parameters to the server.
//
// ***************************************************************************
function setRecords()
{
var inp={};

setInnerHTML("setresult","Status: ");

if(getVal("inputv1")=="" || getVal("inputv2")=="" || getVal("inputv3")=="")
   {
   setInnerHTML("setresult","Status: Error - All items must have a value");
   return;
   }

inp.val1=Number(getVal("inputv1"));
inp.val2=Number(getVal("inputv2"));
inp.val3=getVal("inputv3");

if(isNaN(inp.val1) || isNaN(inp.val2))
   {
   setInnerHTML("setresult","Status: Error - Val1 and Val2 must be integers");
   return;
   }

req('set-records',inp,processSetRecords,errorSetRecords);	
}


// ***************************************************************************
// function: errorSetRecords()
//
// Error setting records
//
// ***************************************************************************
function errorSetRecords(xhr,data,status)
   {
   setInnerHTML("setresult","Status: System - "+xhr.statusText);
   }
   
   
// ***************************************************************************
// function: processSetRecords()
//
// Processes writing of records
//
// ***************************************************************************
function processSetRecords(data,status)
   {
   var chk;
   
   //parse results returned by the server, this is in JSON format
   info=JSON.parse(data);
   
   //check for any application errors from the server API
   chk=checkError(info);
   if(chk.result==1)
      { 
	  setInnerHTML("setresult","Status: "+chk.msg);
      }
   else   
      {
	  setInnerHTML("setresult","Status: Database write success");
	  setVal("inputv1","");
	  setVal("inputv2","");
	  setVal("inputv3","");
	  };
   }


// ***************************************************************************
// function: getRecords()
//
// Request information from a database table. Shows an example of passing
// some parameters to the server.
//
// ***************************************************************************
function getRecords(p1,p2)
{
var inp={};
	
inp.param1=p1;
inp.param2=p2;

req('get-records',inp,processRecords,errorRecords);	
}


// ***************************************************************************
// function: errorRecords()
//
// Error querying for records
//
// ***************************************************************************
function errorRecords(xhr,data,status)
   {
   setInnerHTML("getresult","Status: System - "+xhr.statusText);
   }
   
   
// ***************************************************************************
// function: processRecords()
//
// Processes set of records
//
// ***************************************************************************
function processRecords(data,status)
   {
   var chk;
   var node;
   var n1;
   var i;
   
   //parse records returned by the server, this is in JSON format
   info=JSON.parse(data);
   
   //check for any application errors from the server API
   chk=checkError(info);
   if(chk.result==1)
      {
	  setInnerHTML("getresult","Status: "+chk.msg);
	  if(chk.critical==1) return;
      }
	  
   setInnerHTML("getresult","Status: Database read success");
	  
   //remove the old list of results from DOM if they exist
   node=document.getElementById("record-area");   
   nl=document.getElementById("record-param");
   if(nl!=null) node.removeChild(nl);   
   nl=document.getElementById("record-list");
   if(nl!=null) node.removeChild(nl);

   //create the new list by adding elements to the DOM 
   node.appendChild(makeEle("p",[["class","description-text"],["id","record-param"]],"param1='"+info.p1+"', param2='"+info.p2+"', Num-Records="+info.res.length));
   nl=node.appendChild(makeEle("ul",[["class","description-list"],["id","record-list"]],null));	  
	  
   for(i=0;i<info.res.length;i++)
      {	
      nl.appendChild(makeEle("li",[["class","description-item"],["id","record-item"+i]],info.res[i].val1+" "+info.res[i].val2+" "+info.res[i].val3));
	  };
   }


// ***************************************************************************
// function: req()
//
// This will make a request to the server via a jQuerry AJAX call (XHTML).
// This is a helper function.
//
// ***************************************************************************
function req(sap,inp,processFn,errorFn) 
   {
   var param={};

   param.inp=inp;

   $.ajax(
      {
      type:"POST",
      url:"./api/"+sap,
      //headers:{'Authorization': sessionStorage.getItem("slsesid")},
      data:JSON.stringify(param),
      contentType:"application/json; charset=utf-8",
      success:processFn,
      error:errorFn,
      beforeSend:null,
      complete:null
      });
   } 
   
   
   // ***************************************************************************
   // function: checkError()
   //
   // Check the error status on a return from a call to the server API. This will
   // generate a message string.
   //
   // *************************************************************************** 
   function checkError(res)
      {
      //Application level operational error
      if(res.dbError==1)
         {
         msg="Application Error: "+res.dbErrMsg;
         result=1;
		 critical=1;
         }

      //Application level warning message
      else if(res.dbError==2)
         {
         msg="Application Warning: "+res.dbErrMsg;
         result=1;
		 critical=0;
         }

      //Application level comment message
      else if(res.dbError==3)
         {
         msg="Application Comment: "+res.dbErrMsg;
         result=1;
		 critical=0;
         }

      else if(res.dbError==4)
         {
         msg="System Error: "+res.dbErrMsg;
         result=1;
		 critical=1;
         }
	  else
	     {
	     msg="";
         result=0;	
         critical=0;		 
	     }		 
      
      return {result:result,critical:critical,msg:msg};
      }	     


// ***************************************************************************
// function: makeEle()
//
// Makes a new element and sets attributes and content
//
// ***************************************************************************
function makeEle(tag,att,cont)
   {
   var i;
   var ne;
   var nc;

   ne=document.createElement(tag);
   for(i=0;i<att.length;i++)
      {
      ne.setAttribute(att[i][0],att[i][1]);
      };

   if(cont!=null)
      {
      nc=document.createTextNode(cont);
      ne.appendChild(nc);
      };

   return ne;
   }
   
   // ***************************************************************************
   // function: setInnerHTML()
   //
   // This sets the inner HTML of an element
   //
   // ***************************************************************************
   function setInnerHTML(eleId,val)
      {
      var x;

      x=document.getElementById(eleId);
      if(x==null) return null;

      if(val==null) val=''; 
         
      x.innerHTML=val;
      return x;
      }


   // ***************************************************************************
   // function: getInnerHTML()
   //
   // This gets the inner HTML of an element
   //
   // ***************************************************************************
   function getInnerHTML(eleId,val)
      {
      var x;

      x=document.getElementById(eleId);
      if(x==null) return '';
         
      return x.innerHTML;
      }


   // ***************************************************************************
   // function: setVal()
   //
   // This sets the value of an element
   //
   // ***************************************************************************
   function setVal(eleId,val)
      {
      var x;

      x=document.getElementById(eleId);
      if(x==null) return null;

      if(val==null) val=''; 
         
      x.value=val;
      return x;
      }


   // ***************************************************************************
   // function: getVal()
   //
   // This gets the value of an element
   //
   // ***************************************************************************
   function getVal(eleId)
      {
      var x;

      x=document.getElementById(eleId);
      if(x==null) return null;

      return x.value;
      }


   // ***************************************************************************
   // function: setAtt()
   //
   // This sets the value of an attribute
   //
   // ***************************************************************************
   function setAtt(eleId,att,val)
      {
      var x;

      x=document.getElementById(eleId);
      if(x==null) return null;
         
      x.setAttribute(att,val);
      return x;
      }


   // ***************************************************************************
   // function: getAtt()
   //
   // This gets the value of an attribute of an element
   //
   // ***************************************************************************
   function getAtt(eleId,att)
      {
      var x;

      x=document.getElementById(eleId);
      if(x==null) return null;

      return x.getAttribute(att);
      }
   
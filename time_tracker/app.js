const express = require('express');
const app = express()
const http = require('http').Server(app)
const port = 8080;
const https = require('https');
const puppeteer = require('puppeteer-core');
const dotenv = require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const querystring = require('querystring');
const forced_params = require('./forced_params');
const {askDays, askMonth, askHash} = require('./questions');

var numberOfCommits = 5;
var datesToReport = {
 days:'',
 month:''
};
var environment_data = {
 bs_username: process.env.BEANSTALK_USERNAME,
 bs_password: process.env.BEANSTALK_PASSWORD,
 bs_userid: process.env.BEANSTALK_USERID,
 chrome_path: process.env.CHROME_EXECUTABLE_PATH,
 last_reported_commit: process.env.LAST_REPORTED_COMMIT
}

async function askQuestions() {
 try {
  datesToReport.days = await askDays();
  datesToReport.month = await askMonth();
  environment_data.last_reported_commit = environment_data.last_reported_commit||await askHash();
  console.log(environment_data.last_reported_commit);
  await formatDaysToReport();
  var page = await initBrowser();
  page = await login(page);
 } catch (e) {
  console.log('error');
  console.log(e);
  return
 } finally {
  startNavigation({page:page})
 }
}

async function startNavigation(params) {
 var page = params.page;
 if (params.lastCommitHash) {
  environment_data.last_reported_commit = params.lastCommitHash;
 }
 try {
  var commitsToReport = false;
  var pendingCommits = [];
  do {
   commitsToReport = await searchForHash({page:page});
   if (commitsToReport === false) {
    page = await goToNextPage(page)
   }
   // if (commitsToReport === false) el ultimo hash reportado no esta en esta pagina
  } while (commitsToReport === false);
  console.log('commitsToReport.length ',commitsToReport.length);
  if (commitsToReport.length === 0) {
   //if commitsToReport.length === 0 es porque el ultimo commit reportado es el ultimo commit de esa pagina
   page = await goToPreviousPage(page)
   commitsToReport = await searchForHash({page:page,alreadyCheckedNextPage:true});
  } else if (commitsToReport.length >= 1 && commitsToReport.length <= numberOfCommits-1) {
   page = await goToPreviousPage(page)
   pendingCommits = commitsToReport;
   commitsToReport = await searchForHash({page:page,alreadyCheckedNextPage:true});
  }
  if (pendingCommits.length!=0) {
   console.log({commitsToReport});
   console.log({pendingCommits});
   commitsToReport = await concatPendingCommits({
    commitsToReport:commitsToReport, 
    pendingCommits:pendingCommits
   })
   console.log({commitsToReport});
  }
  var formatedPostData = await prepareCommitsForOneDay({
   commitsToReport:commitsToReport,
   datesToReportDays:datesToReport.days[0],
   page:page
  });
  var formatedParams = await formatRequest(formatedPostData)
  await sendData(formatedParams);
  console.log({formatedPostData});
  await saveLastReportedCommit({lastCommitHash:formatedPostData.lastCommitHash});
  datesToReport.days.shift()// removes reported day
  console.log({datesToReport});
 } catch (e) {
  console.log('error');
  console.log(e);
 } finally {
  if (datesToReport.days.length > 0) {
   startNavigation({page:page, lastCommitHash:formatedPostData.lastCommitHash});
  } else {
   console.log('Se terminaron los dias que reportar');
   process.exit();
  }
 }
}

async function searchForHash(params) {
 return new Promise(async function(resolve, reject) {
  params.alreadyCheckedNextPage = params.alreadyCheckedNextPage||false;
  var commitsInCurrentPage = await getAllCommitsFromPage(params.page)
  var commitsToReport = await checkCommits({
   commitsInCurrentPage:commitsInCurrentPage,
   alreadyCheckedNextPage: params.alreadyCheckedNextPage
  })
  console.log('commitsToReport ',commitsToReport);
  resolve(commitsToReport);
 });
}

function formatDaysToReport(){
 return new Promise(function(resolve, reject) {
  datesToReport.days.toString();
  var daysToArray = datesToReport.days.split(',');
  datesToReport.days = daysToArray;
  console.log(datesToReport);
  resolve();
 });
}

async function initBrowser() {
 return new Promise( async function(resolve, reject) {
  const browser = await puppeteer.launch({
   executablePath:environment_data.chrome_path,
   headless:false,
   slowMo:100, 
   devtools:true,
   timeout:30000
  });
  const page = browser.newPage();
  resolve(page)
 });
}

async function login(page) {
 await page.goto('https://connexient.beanstalkapp.com/session/new',{waitUntil: 'load', timeout: 0});
 await page.focus('#username')
 await page.keyboard.type(environment_data.bs_username)
 await page.focus('#password')
 await page.keyboard.type(environment_data.bs_password)
 await page.click('input[type="submit"]')
 await page.goto(`https://connexient.beanstalkapp.com/search?u=${environment_data.bs_userid}`);
  return(page);
 }
 
 async function getAllCommitsFromPage(page){
  return page.evaluate(()=> {
   var allCommitsElements = $('.rev-comment p a');
   var formatedCommits =[];
   for (var current in allCommitsElements) {
    if (allCommitsElements.hasOwnProperty(current) && Number.isInteger(Number(current))) {
     let commitData ={
      message:allCommitsElements[current].innerText
     };
     formatedCommits.push(commitData)
    }
   }
   return formatedCommits;
  }).then(function (data) {
   return data
  })
 }
 
 async function checkCommits(params) {
  if (params.alreadyCheckedNextPage) {
   return params.commitsInCurrentPage;
  }
  var found = false;
  for (var commit in params.commitsInCurrentPage) {
   if (params.commitsInCurrentPage.hasOwnProperty(commit)) {
    var currentCommitHash = params.commitsInCurrentPage[commit].message.slice(0,8)
    if (currentCommitHash === environment_data.last_reported_commit) {
     //remove already reported commits
     params.commitsInCurrentPage.splice(Number(commit));
     return params.commitsInCurrentPage;
    }else {
     console.log('buscando ultimo commit reportado');
    }
   }
  }
  return false;
 }
 
 //params = commitsToReport, pendingCommits
 async function concatPendingCommits(params) {
  var commitsToReport = params.commitsToReport;
  var pendingCommits = params.pendingCommits;
  if (commitsToReport && pendingCommits) {
   return commitsToReport.concat(pendingCommits);
  }
  return false;
 }
 
 //params = commitsToReport, dayToReport
 async function prepareCommitsForOneDay(params){
  var commitsToReport = params.commitsToReport;
  var dayToReport = params.datesToReportDays;
  var month = datesToReport.month
  if (commitsToReport.length >= numberOfCommits) {
   var lastCommitHash = commitsToReport[commitsToReport.length-numberOfCommits].message.slice(0,8);
   var descriptionString = '';
   for (var i = commitsToReport.length-1; i >= commitsToReport.length-numberOfCommits; i--) {
    descriptionString= `${descriptionString}${commitsToReport[i].message} `
   }
   console.log({lastCommitHash});
   var postData = {
    dayToReport: dayToReport,
    description: descriptionString,
    lastCommitHash: lastCommitHash
   }
   return postData
  }
 }
 
 async function goToPreviousPage(page, commitsToReport) {
  return new Promise(async function(resolve, reject) {
   var currentPage = await page.evaluate(function () {
    var url_string = window.location.href
    var url = new URL(url_string);
    var currentPage = url.searchParams.get("page");
    currentPage = Number(currentPage);
    return currentPage;
   })
   console.log({currentPage});
   if (currentPage >=2) {
    var pageToNavigate = currentPage - 1;
    await page.goto(`https://connexient.beanstalkapp.com/search?page=${pageToNavigate}&u=523487`,{waitUntil: 'load', timeout: 0});
     resolve(page)
    }else if (currentPage === 1) {
     console.log('ya no hay mas paginas ni commits que revisar');
     reject();
    }
   });
  }
  
  async function goToNextPage(page) {
   return new Promise(async function (resolve, reject) {
    var currentPage = await page.evaluate(function () {
     var url_string = window.location.href
     var url = new URL(url_string);
     var currentPage = url.searchParams.get("page");
     currentPage = currentPage?currentPage:1
     currentPage = Number(currentPage);
     return currentPage;
    })
    console.log({currentPage});
    var pageToNavigate = currentPage + 1;
    await page.goto(`https://connexient.beanstalkapp.com/search?page=${pageToNavigate}&u=523487`,{waitUntil: 'load', timeout: 0});
     pageToNavigate++;
     resolve(page)
    });
   }
   
   async function formatRequest(formatedPostData){
    return new Promise(function(resolve, reject) {
     var description = formatedPostData.description.replace(/'/g, '');
     description = encodeURIComponent(description)
     var formatedDate = `${formatedPostData.dayToReport}/${datesToReport.month}/2019`;
     var data = {
      ctl00$ContentPlaceHolder$txtFrom:formatedDate,
      ctl00$ContentPlaceHolder$idProyectoDropDownList:197,
      ctl00$ContentPlaceHolder$TiempoTextBox:8,
      ctl00$ContentPlaceHolder$idTipoAsignacionDropDownList:1,
      ctl00$ContentPlaceHolder$idFocalPointClientDropDownList:10030,
      ctl00$ContentPlaceHolder$btnAceptar:'Accept',
      __VIEWSTATE:forced_params.__VIEWSTATE,
      __EVENTVALIDATION:forced_params.__EVENTVALIDATION
     }
     var dataAsQueryString = querystring.stringify(data);
     var descriptionParamQS = querystring.stringify({ctl00$ContentPlaceHolder$DescripcionTextBox:''});
     //the description has a 500 character limit on timetracker
     description = description.substring(0, 500);
     var fullDescription = descriptionParamQS+description;
     dataAsQueryString = dataAsQueryString+'&'+fullDescription;
     resolve(dataAsQueryString)
    });
   }
   
   async function sendData(queryStringParams) {
    return new Promise(function(resolve, reject) {
     console.log({queryStringParams});
     var headers = {
      'Connection':'keep-alive',
      'Content-Type':'application/x-www-form-urlencoded',
      'Cookie':'ASP.NET_SessionId=pkitlwsrywi3soyyhmiz2zhn; idProyectoAnterior=197; idTipoAsignacionAnterior=1; idFocalPointAnterior=10030',
     }
     axios({
      method:'post',
      url:'https://timetracker.bairesdev.com/CargaTimeTracker.aspx',
      data:queryStringParams,
      headers:headers
     })
     .then(function (response) {
      console.log(response.request.res.responseUrl);
      if (response.request.res.responseUrl==='https://timetracker.bairesdev.com/CargaTimeTracker.aspx') {
       reject('Time not saved')
      } else {
       // response.request.res.responseUrl==='https://timetracker.bairesdev.com/ListaTimeTracker.aspx');
       console.log('SUCCESS');
       resolve();
      }
     })
     .catch(function (error) {
      console.log(error);
      reject();
     });
    });
   };
   
   async function saveLastReportedCommit(params){
    return new Promise(function(resolve, reject) {
     var lastCommitHash = params.lastCommitHash;
     fs.readFile(`./.env`, 'utf-8',(err, contents) => {
      if (err) {
       console.log('cannot read .env file');
       console.log(err);
       reject(err)
      }
      var startPosition = contents.indexOf('LAST_REPORTED_COMMIT')+21;
      var bufferedText = Buffer.from(lastCommitHash);
      var file = fs.openSync('./.env','r+');
      fs.write(file, bufferedText,0, bufferedText.length, startPosition, function (err, writen, buffer) {
       if (err) {
        console.log('cannot write last commit on .env file');
        console.log(err);
        reject(err)
       }
       console.log(`Successfully writen ${writen} bytes on .env`);
       resolve()
      }) 
     });
    });
   }
   
   http.listen(port,function (err) {
    if (err) return console.log(err);
    console.log(`Server corriendo en el puerto ${port}`);
    askQuestions();
   })

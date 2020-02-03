//These params must be on the POST request, otherwise it fails 

 var __VIEWSTATE = '/wEPDwUKMTk4MzU4MDI0NQ9kFgJmD2QWAgIDD2QWAgIFD2QWAgIDD2QWAmYPZBYWAgEPDxYCHgdWaXNpYmxlaGQWBgIBDxAPFgQeB0VuYWJsZWRoHwBoZGRkZAIDDw8WAh8AaGRkAgUPDxYCHwBoZGQCBA8WAh4MU2VsZWN0ZWREYXRlBgDAoScUN9dIZAIFDw8WAh8AaGQWAgIBDw8WAh4EVGV4dGVkZAIGDw8WAh8AaGRkAggPEA8WAh4LXyFEYXRhQm91bmRnZBAVAwATQmFpcmVzRGV2IC0gQWJzZW5jZRdDb25uZXhpZW50IC0gQ29ubmV4aWVudBUDAAE0AzE5NxQrAwNnZ2dkZAIKDw9kDxAWAWYWARYCHg5QYXJhbWV0ZXJWYWx1ZSgpWVN5c3RlbS5JbnQ2NCwgbXNjb3JsaWIsIFZlcnNpb249NC4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCBQdWJsaWNLZXlUb2tlbj1iNzdhNWM1NjE5MzRlMDg5BDE0MzYWAQIFZGQCDA8PFgIfAwUBOGRkAg8PEA8WAh8EZ2QQFSYAEkFjY291bnQgTWFuYWdlbWVudA5BZG1pbmlzdHJhdGlvbhNBcHBsaWNhbnRzIFNvdXJjaW5nC0NhbGwgQ2VudGVyGENvZGluZyBDaGFsbGVuZ2VzIFJldmlldyZDb21tdW5pY2F0aW9uIChuZXdzbGV0dGVyLCBub3RhcywgZXRjKRhDb25maWd1cmF0aW9uIE1hbmFnZW1lbnQKRGF0YSBFbnRyeQNEQkEVRXhlY3V0aXZlIEhlYWRodW50aW5nCkZhY2lsaXRpZXMXRmFybWluZyAtIFN0YWZmaW5nIEhlcm8HRmluYW5jZRFIZWxwIERlc2svU3VwcG9ydA9IdW1hbiBSZXNvdXJjZXMXSW5mcmFzdHJ1Y3R1cmUvSGFyZHdhcmUKTWFuYWdlbWVudAlNYXJrZXRpbmcJTWVudG9yaW5nFk9uIEJvYXJkaW5nICYgVHJhaW5pbmcOT24gQ2FsbCBEdXRpZXMIUHJlc2FsZXMLUmVjcnVpdG1lbnQSUmVwb3J0cyBHZW5lcmF0aW9uBVNhbGVzDVNhbGVzIFN1cHBvcnQbU2luIHRhcmVhcyBhc2lnbmFkYXMgLyBJZGxlFFNvZnR3YXJlIERldmVsb3BtZW50CFNvdXJjaW5nIVNvdXJjaW5nIFdlZWtlbmQgU2hpZnQgLyBPVCBIb3VycwhTdGFmZmluZxRUZWNobmljYWwgSW50ZXJ2aWV3cxRUZWNobmljYWwgSW50ZXJ2aWV3cwtUZXN0IFJldmlldwdUZXN0aW5nCFRyYWluaW5nFFVJL1VYL0dyYXBoaWMgRGVzaWduFSYAAjIxATYCMzEBNwIzNAIxMQIxNQIxNwIxNAIzMAIyNQIyOQIyMwIyMgIyNwIxNgE1AjIwAjQzAjM4AjM5AjQxATIBOAIxOQIzNwE5ATECMzYCNDQCMjQCMzICNDICMzMCMTMBNAIxMBQrAyZnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2RkAhEPD2QPEBYBZhYBFgIfBQUDMTk3FgFmZGQCFg8QDxYCHwRnZBAVAwAQTmV2aWxsZSBPcmVsbGFuYQxTcmRqYW4gRGFraWMVAwAFMTAwMzAFMTAxNDAUKwMDZ2dnZGQCGA8PZA8QFgFmFgEWAh8FBQMxOTcWAWZkZGQ/HZX7tnDVgLMn+72Oj9VUedJpai3COORxTTy+SsboaQ==';
 
 var __EVENTVALIDATION = '/wEdADJU2sJ2vJ8BTnd8P8gAOLKa4x8AhbDk1OuzysNknnQllt3X1JqGigG7nsR3K2Z9atJZSl7umE462MZQuzch1tKgkevvYD/DAmEpbWCvpydC7YshYDBjI3ie7zA3v+BHt7Awi8AYCwa4v8vSp7qSuJkFJb6kBb1rJj1apcIu08munXHgaJAZZ96SjfBckRmOzITe44rLG4YBmmG4AgvMVNEe4TXZugaVO6S7Aeb5DmHbWcLWxRTqsh2wLosomSjksGU7cZyTSvQuVhk11+iMPlkHrGfSEF2HOoK2tZwfwhGko7ncXudicreAtE3COS6c+bu9wAgZAMDqNRYixGi+Has88yYoveIKIL1hn8APRGfKyAp9b31jDLJui/UQp0V658weFpM0rV9IhDfmlWDsCa22mjLpabdRUN758Od0yw0K3m7LAKoqO+9e/UI9wQUzzYraFpuurrchrO9sG3EOx9+R5y/Me4RRaN2yaO/1gOYoqKixbpLrd5b1tQP4pikN8PKegbjAn+k/8+stwNbJWypxyCAwpWvdCqtJfHU5T71AustJBzAvMkin1DcArkj6rIMhhN9hFhGhYa5KmlA2jFjiHlOeoE8t0cJijVsy9VdXQgBVcnAYrD7IdROOSdbS/Dhu6jsm/Ul5bdVCZs0RyOs7BrEH6H6mOEMWCkOlFML39Bs6l4dxwD+NDla8IsmNsBD3VltifgynrUGF7+NxB+l0Hr6MhusWmpTtwtQDOfDNCmPUAcpc736HgJ4wcBzTuGYMagVeJQNcG9YkUaGMscNCc5BQBoLJwn0RGDLmxLtrV7rYPAsLcOe9nfIbIy56/tsO9m0Tubuk78AIvL3UaMMMkBb0NXqvpcMeOSAQicOioUXNObavqENl147il6za9TfOh9Ybw0YjeU4qVXS+Q2NaOLZc5JAu5/C2W8n9mVltyOeugdivMsVjwD+kdbC9XXY6RwYZZuYohawcE5UWja/D3dYr7lK9ySufpkO80DdRuy0rHx5Rq+1koY0Q5xBg/i77vRAlv/Jfzi5niFsJcPEtOv4xVaY4l3rGrTfvNmMENt2Xz2IiOaaPmJJXgSgNwmElw80yS/G49E8U2j/NQBg5';
 
 var __VIEWSTATEGENERATOR = '36DF8DAE';
 
 var __HEADERS = {
  'Connection':'keep-alive',
  'Content-Type':'application/x-www-form-urlencoded',
  'Cookie':'ASP.NET_SessionId=nwsqy2fphabfyfeulkhq5ula; idProyectoAnterior=197; idTipoAsignacionAnterior=1; idFocalPointAnterior=10030',
 };
 
 module.exports ={
  __VIEWSTATE,
  __EVENTVALIDATION,
  __VIEWSTATEGENERATOR,
  __HEADERS
}














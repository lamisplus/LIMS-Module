
export const  token = (new URLSearchParams(window.location.search)).get("jwt")
export const url = '/api/v1/'

/*
export const url =  'http://localhost:8282/api/v1/';
export const apiUrl =  'http://localhost:8282/api/';
export const  token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNjc0MzUzMTYxfQ.dFYzmTuNElEkOlHOhQthf3LfAji6S9ADODh-RohHWp7w5TJBVxC8GcO8IRYJBWAmfEsVTMtQBgVnI4b2NjT5Cg';
*/
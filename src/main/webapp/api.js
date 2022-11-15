
export const  token = (new URLSearchParams(window.location.search)).get("jwt")
export const url = '/api/v1/'

/*
export const url =  'http://localhost:8282/api/v1/';
export const apiUrl =  'http://localhost:8282/api/';
export const  token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNjY4NTU2NjQwfQ.tx0FZZz2d0OldYHXXqhofQ3tXDI57HAp-fu7eFmxjHCQAGVjyw-nIkanfXTuXSHSjM_Rteitrjydnemn2qkYJw';
*/
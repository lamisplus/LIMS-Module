
export const  token = (new URLSearchParams(window.location.search)).get("jwt")
export const url = '/api/v1/'

/*
export const url =  'http://localhost:8282/api/v1/';
export const apiUrl =  'http://localhost:8282/api/';
export const  token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNjc0NDQxNjQ2fQ.MXZGeV_EGzYH1FOfrfCnxLKxRcj7k8QsleF1wgVgpqGzxG0MZeI9UTYhhFAomk_CLalVbGHA5_fdiFvYkbt50A';
*/
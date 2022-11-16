
export const  token = (new URLSearchParams(window.location.search)).get("jwt")
export const url = '/api/v1/'

/*
export const url =  'http://localhost:8282/api/v1/';
export const apiUrl =  'http://localhost:8282/api/';
export const  token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNjY4NjQ2NzkzfQ.Ev0tOH_8UONq0HT6Q0ih9vKJCaxWY-r-g7p-1St-QLDIvAN5f9gfst1EB4zJo8XDAp-rF3W9LX3-kS3WvVwPFQ';
*/
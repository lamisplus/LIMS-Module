
export const  token = (new URLSearchParams(window.location.search)).get("jwt")
export const url = '/api/v1/'

/*
export const url =  'http://localhost:8282/api/v1/';
export const apiUrl =  'http://localhost:8282/api/';
export const  token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNjY4NTgxMzg3fQ.8EQzz98fN92aXty6gH3K_mB5EUfEGQkbGmxVX9GgHbIMvCr1gCrFSi8WeT7P7vcdIUZURgquPTILZ3Id731bSg';
*/
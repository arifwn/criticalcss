Critical CSS API Server
=======================

Required environmental variable:

- `SECRET_KEY`: used for shared key authentication

Sample usages:

- `curl -d "url=https://groverwebdesign.com/&key=MYSECRETKEY" -X POST http://localhost:3000/web/submit/`
- `curl -d "url=https://groverwebdesign.com/&key=MYSECRETKEY&callback_url=http://httpbin.org/post" -X POST http://localhost:3000/api/submit/async/`

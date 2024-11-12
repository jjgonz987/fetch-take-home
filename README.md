To run locally

To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

with Docker

1. clone the project
2. cd into project
```sh
3. build docker image
 docker build -t fetch_project_home .
```
```sh
4. run docker image
 docker run -d -p 3000:3000 fetch_project_home
```
5. open http://localhost:3000
6.  test post endpoint http://localhost:3000/receipts/process
7.  test get endpoint http://localhost:3000/receipts/:id/points

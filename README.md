# ShmsFront

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.2.

## Development server

After you cloned this repository to your local machine, position to the root of cloned Angular project and create docker image with this command:
```bash
docker build -t shms-front .
```

Next step is to run docker container with this command:
```bash
docker run -p 4201:4200 shms-front
```

Once the server is running, open your browser and navigate to `http://localhost:4201/`.

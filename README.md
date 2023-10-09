# Poolistik
An API Service for managing, booking pool tables. I built this repo to practice building NestJS boilerplate code, monorepo and microservices.
The main infrastructure can be found in the /infrastructure dir. This infra is used for every new service in this system, ensuring the integrity of the system. 
## Tech Stack
NestJS
## Features
- Authentication: JWT with Access/Refresh Token. I have applied Refresh Token Rotation, hence, tokens can be used in local storage. 
- Authorization: Role based authorization using JWT Token and Guards.
- Typeorm Boilerplate: With base entity and base Orm entity for DDD.
- Jwt Boilerplate
- Swagger: generate interactive Api docs.
- Config Boilerplate
- Pagination Boilerplate: implement using Offset/Limit technique.
- CRUD User
- Payload validation using pipe
- Soft delete
- Redis for session token -> Reduce latency
## TODO
- Reset password by email
- CRUD Poolhall
- Implement pool table booking
- Implement Kafka Boilerplate
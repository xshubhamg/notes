---
title: HTTP
description: Hyper Text Transfer Protocal
date: 2022-01-01
---

## Jargon's related to HTTP protocol

- **URL** : Uniform Resource Locator
- **URI** : Uniform Resource Identifier
- **URN** : Uniform Resource Name
- **HTTP headers** : metadata [key-value sent along with request & response]
	- Response header : came from server
	- Request header : came from client
	- Representation header : encoding / compression
	- Payload header : sending data to client or server

## HTTP methods

Basic sets of operations that can be used to interact with server.

- *GET* : retrieve resource
- *HEAD* : no message body (response header only)
- *OPTIONS* : what options are available
- *TRACE* : loop back test
- *DELETE* : Remove a resource
- *PUT* : replace a resource
- *POST* : interact with resource (mostly add)
- *PATCH* : change part of a resource

### Idempotent v/s Non-idempotent

- **GET**, **PUT**, **DELETE**, **HEAD** are idempotent kinds of methods as they don't make any changes to the data on the server.
- **PATCH**, **POST**, **TRACE** are non-idempotent kinds as it create new resource inside the server.

## HTTP status code

- *1XX* : Informational
- *2XX* : Success (`200`: successful action , `201`: successful creation , `204`: no content but get success header)
- *3XX* : Redirection (`301`: moved permanently, `302`: temporery redirect , `304`: not modified resource)
- *4XX* : Client error (`400`: bad request, `401`: unauthorized, `403`: forbidden, `404`: page not found, `405`: method not allowed, `409`: conflict, `429`: too many request)
- *5XX* : Server error (`500`: internal server error, `501`: not implimented yet, `502`: bad gateway or invalid request, `503`: service unavialable or maintainance, `504`: gateway timeout)



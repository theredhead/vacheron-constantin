# vacheron-constantin
Client/Server app combination using NestJS, Angular and socket.io to keep watch over servers.

This tool continuously pings 1..n hosts and reports on the results as close to realtime as possible.

## Backend
Starts pinging all hosts in a list asynchronously as soon as a client connects. For each ping that 
returns a result, all clients are updated and the next ping to that host is scheduled if at least one
client is still connected.

## Frontend
Connects to the backend to receive ping result updates and presents them visually.


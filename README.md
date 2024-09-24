# JSON Receiver

This is a simple JSON receiver that listens for incoming JSON data on a specified port and prints it to the console.

```txt
Options:
  --version  Show version number                                       [boolean]
  --port     Port to run the server on                  [number] [default: 3000]
  --path     Path to serve                              [array] [default: ["/"]]
  --out      Path to write JSON data as ndjson format. If not provided, it will
             not write.                                                 [string]
  --help     Show help                                                 [boolean]
```

## Installation

```sh
npm install -g json-receiver
```

## Usage

```sh
json-receiver --port 3000 --path /api
# http://localhost:3000/api will be the endpoint to send JSON data

json-receiver --port 3000 --path /api --out data.ndjson
# JSON data will be written to data.ndjson
```

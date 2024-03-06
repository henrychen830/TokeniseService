# Tokenisation Service

## Getting Started
* Clone the repo and clean install
  ```
  git clone https://github.com/henrychen830/TokeniseService.git
  npm ci
  ```
* Start node server
  ```
  npm start
  ```

## Testing
- Unit tests
  ```
  npm test
  ```
- Curl endpoints for endpoint testing
  ```
  curl -X POST http://localhost:3000/tokenize -H "Content-Type: application/json" -d '["4111-1111-1111-1111", "4444-3333-2222-1111", "4444-1111-2222-3333"]'
  ```
  ```
  curl -X POST http://localhost:3000/detokenize -H "Content-Type: application/json" -d '["U2FsdGVkX1+h88Anw5gEhrEB+o7iluT/GOFlDlUBqA98mpT63tKvnAqfV/D7BKds","U2FsdGVkX1+w/ejlZytLuJ40RgD73OMoa0i1wb2hAOn9f9QcHwsO9nGQdq5/7ORC","U2FsdGVkX1+0x0VW7586PMLnCmuzndrY1mcu/fLHzswNyC0efre/w7BF9UFDHCcX"]' 
  
  NOTE: Replace tokens with the ones created from tokenise endpoint
  ```

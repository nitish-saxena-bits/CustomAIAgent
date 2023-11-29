# AI Assignment
## Video Link: 
### Installation
- Clone this GitHub repo https://github.com/nitish-saxena-bits/CustomAIAgent.git or extract from zip file.
- Install dependencies.
    - Open git folder in command prompt/bash.
    - Navigate to backend folder.
      -  cd backend
    - Install node js dependencies (backend server).
      - npm install
    - Navigate to frontend folder.
      - cd..
      - cd frontend
    - Install react dependencies (frontend client).
      - npm install

### Execution
- Update values of __organization__ and __apiKey__ in https://github.com/nitish-saxena-bits/CustomAIAgent/blob/master/backend/index.js in *OpenAIApiAccessConfig* constant from OpenAI account
- Current limit is set to 3 for calling OpenAI embeddings API endpoint in a minute for personal free tier accounts so operate accordingly. By default the code ignores rest of the pdf after 2 paragraphs are used for embeddings.
- Open git folder in command prompt/bash.
- Navigate to backend folder.
  - cd backend
- Run node js server.
  - node index.js
- Navigate to frontend folder.
  - cd..
  - cd frontend
- Run react based client.
  - npm run dev
- Navigate to http://localhost:3000 from any web browser.
- Upload pdf and wait for confirmation message.
- Start querying
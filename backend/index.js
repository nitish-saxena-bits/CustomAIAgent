import OpenAI from 'openai'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const server = express();
const serverPort = 8080;
server.use(bodyParser.json());
server.use(cors());

const OpenAIApiAccessConfig = {
    organization: "org-PP3qdcV6RVbieV6GpZGgjDpa",
    apiKey:  "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"
};

const openAI = new OpenAI(OpenAIApiAccessConfig);

server.post("/", async (request, response) => {

    const {chats} = request.body;

    const openAIApiResponse = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "Hi!, this is from system role API call!"
            },
            ...chats
        ]
    });

    response.json({
        agentReply: openAIApiResponse.choices[0].message
    });
});

server.listen(serverPort, () => {
    console.log(`listening on port ${serverPort}`);
})
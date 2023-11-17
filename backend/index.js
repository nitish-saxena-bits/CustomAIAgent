import OpenAI from 'openai'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());

const config = {
    organization: "",
    apiKey:  ""
};

const openAI = new OpenAI(config);

app.post("/", async (req, res) => {
    const {chats} = req.body;

    const result = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are myGPT, you can write emails and letters."
            },
            ...chats
        ]
    });

    res.json({
        output: result.data.choices[0].message
    });

});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
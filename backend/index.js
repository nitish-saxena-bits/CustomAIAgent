import OpenAI from 'openai'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import parse from 'pdf-parse';
import calculateCosineSimilarity from './cosineSimilarity.js';

const server = express();
const serverPort = 8080;
server.use(bodyParser.json());
const storage = multer.memoryStorage();
const upload = multer({ storage });
server.use(cors());

const OpenAIApiAccessConfig = {
    organization: "",
    apiKey: ""
};

let embeddingsDatabase = {
    pdfEmbeddings: [],
    pdfData: [],
};

const openAI = new OpenAI(OpenAIApiAccessConfig);

server.post("/", async (request, response) => {

    const { chats } = request.body;

    const inputQueryEmbeddings = await generateEmbeddings(chats[chats.length - 1].content);

    const similarities = embeddingsDatabase.pdfEmbeddings.map(pdfEmbeddings =>
        calculateCosineSimilarity(inputQueryEmbeddings, pdfEmbeddings)
    );

    const mostSimilarIndex = similarities.indexOf(Math.max(...similarities));

    const similarityThreshold = 0.7;

    if (similarities[mostSimilarIndex] > similarityThreshold) {

        const combinedInput = `${chats[0].content} ${embeddingsDatabase.pdfData[mostSimilarIndex]}`;

        const openAIApiResponse = await openAI.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Hi!, this is from system role API call!"
                },
                {
                    role: "user",
                    content: combinedInput,
                },
            ]
        });

        response.json({
            agentReply: openAIApiResponse.choices[0].message
        });
    }
    else {
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
    }
});

server.post("/getembedding", async (request, response) => {

    const pdfPath = ""

    const openAIEmbeddingApiResponse = await openAI.embeddings.create({
        model: "text-embedding-ada-002",
        input: request.body.pdftext,
        encoding_format: "float",
    });

    response.json({
        embeddings: openAIEmbeddingApiResponse
    });
});

server.post("/upload", upload.single('pdf'), async (request, response) => {
    try {
        const uploadedFile = request.file;

        const pdfContent = Buffer.from(uploadedFile.buffer);

        if (pdfContent.length === 0) {
            reject('Empty pdf');
        }

        const pdfData = await parse(pdfContent);

        const sentences = pdfData.text.split(/[.!?]/).filter(sentence => sentence.trim() !== '');
        const sentencesPerParagraph = 20;
        const paragraphs = [];
        for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
            const paragraph = sentences.slice(i, i + sentencesPerParagraph).join(' ');
            paragraphs.push(paragraph);
        }

        const max_rate_limit = 3;
        let counter = 0;
        for (const paragraph of paragraphs) {
            counter = counter + 1;
            if (counter < max_rate_limit) {
                const paragraphEmbeddings = await generateEmbeddings(paragraph);

                embeddingsDatabase.pdfEmbeddings.push(paragraphEmbeddings);
                embeddingsDatabase.pdfData.push(paragraph);
            }
            else {
                // reject remaining sentences as no budget
            }
        }

        response.json({
            message: "File Uploaded, Parsed and embeddings fetched!"
        })
    }
    catch (error) {
        console.error('Error processing upload:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
})

async function generateEmbeddings(text) {
    try {

        const openAIEmbeddingApiResponse = await openAI.embeddings.create({
            model: "text-embedding-ada-002",
            input: text,
            encoding_format: "float",
        });

        const embeddings = openAIEmbeddingApiResponse.data[0]?.embedding || '';

        return embeddings;

    } catch (error) {
        if (error.response && error.response.status === 429) {
            await new Promise(resolve => setTimeout(resolve, 60000));
            return generateEmbeddings(text);
        }
        else {
            throw new Error(`OpenAI API request failed: ${error.message}`);
        }
    }
}

server.listen(serverPort, () => {
    console.log(`listening on port ${serverPort}`);
});
import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "./Utilities/Array+Extensions"
import { infer } from "./Inference/InferenceProvider";
import AppStrings from "./Utilities/AppStrings";


var corsOptions = {
    origin: process.env.FRONTEND_URL ?? "",
    optionsSuccessStatus: 200
}

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.send("neighby.service.mothership ✨");
});

app.post("/infer", async (req: Request, res: Response) => {
    try {
        const prompt = req.body.prompt
        const inference = await infer(prompt)
        res.json({ inference: inference });
    } catch (error) {
        console.log(`Error. /infer failed. ${error}`)
        res.json({ inference: AppStrings.errorWildcard });
    }
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
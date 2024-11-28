import express, { Request, Response } from "express";
import { DATABASE_URL, LINKS_PASSWORD, PORT } from "./env";
import { connectToDatabase, getLink } from "./db";

function initApp() {
  const app = express();

  app.get("/", async (req, res) => {
    res.json({
      message: "This is a URL shortener API from https://www.devpulkit.in",
    });
  });

  app.get("/:name", async (req: Request, res: Response): Promise<any> => {
    const { name } = req.params;
    if (!name) return res.status(400).send("Invalid Link");
    const resumeLink = await getLink(name);
    if (!resumeLink) return res.status(404).send("Link not found");
    if (resumeLink.passwordProtected) {
      const { p: password } = req.query;
      if (!password) return res.status(400).send("Password Required");
      if (password !== LINKS_PASSWORD)
        return res.status(401).send("Invalid Password");
    }
    resumeLink.visitCount++;
    await resumeLink.save();
    if (!resumeLink.link) return res.status(404).send("Link not found");
    return res.redirect(resumeLink.link);
  });

  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
}

function runProcess(PROCESS: any) {
  connectToDatabase(DATABASE_URL).then(async () => {
    await PROCESS();
  });
}

runProcess(initApp);

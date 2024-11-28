import { addLink, connectToDatabase, getLink } from "../db";
import { DATABASE_URL } from "../env";
import links from "./links.json";

async function addLinks() {
  for (const link of links) {
    const existingLink = await getLink(link.name);
    if (existingLink) continue;
    await addLink(link);
    console.log(`Added link ${link}`);
  }
}

function runProcess() {
  connectToDatabase(DATABASE_URL).then(async () => {
    await addLinks();
  });
}

runProcess();

import "dotenv/config";
import { Command } from "commander";
import { isSpamBio, DEFAULT_SPAM_PHRASES } from "./index.js";
import { githubRequest, blockUser } from "./github.js";

const program = new Command();

program
    .name("gh-spam-blocker")
    .description("Block GitHub users with spam solicitation in their profiles")
    .option("--dry-run", "Show who would be blocked without blocking")
    .option(
        "--phrase <text>",
        "Add an additional spam phrase",
        (value, previous) => {
            previous.push(value);
            return previous;
        },
        []
    )
    .option(
        "--max-pages <number>",
        "Limit how many follower pages to scan",
        value => parseInt(value, 10)
    )
    .parse(process.argv);

const options = program.opts();

const token = process.env.GITHUB_TOKEN;
if (!token) {
    console.error("GITHUB_TOKEN environment variable is required");
    process.exit(1);
}

const phrases = [
    ...DEFAULT_SPAM_PHRASES,
    ...options.phrase
];

console.log("gh-spam-blocker starting");
console.log("Dry run:", Boolean(options.dryRun));

console.log("");

console.log("Scanning followers...");

//get followers in batches of 100 until we get an empty batch
let page = 1;
let followers = [];

while (true) {
    const batch = await githubRequest(
        `/user/followers?per_page=100&page=${page}`,
        token
    );
    if (batch.length === 0) break;
    followers.push(...batch);
    page++;
}

// helpy: check profile README
async function readmeMatches(username) {
    try {
        const readme = await githubRequest(
            `/repos/${username}/${username}/readme`,
            token
        );

        if (!readme?.content) return false;

        const text = Buffer.from(readme.content, "base64").toString("utf8");
        return isSpamBio(text, phrases);
    } catch (e) {
        //404 = no profile README
        return false;
    }
}

for (const follower of followers) {
    const profile = await githubRequest(`/users/${follower.login}`, token);

    let bioMatch = false;
    let readmeMatch = false;

    if (profile.bio && isSpamBio(profile.bio, phrases)) {
        bioMatch = true;
    } else {
        readmeMatch = await readmeMatches(follower.login);
    }


    if (bioMatch || readmeMatch) {
        console.log("SPAM FOUND");
        console.log("User:", follower.login);

        if (bioMatch) {
            console.log("Source: bio");
            console.log("Bio   :", profile.bio);
        } else {
            console.log("Source: profile README");
        }

        if (options.dryRun) {
            console.log("→ DRY RUN: would block");
        } else {
            await blockUser(follower.login, token);
            console.log(" X BLOCKED");
        }

        console.log("");
    }
}
console.log("Scan complete.");

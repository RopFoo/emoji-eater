import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { MAIN_URL } from "./constants";
import { Emoji } from "./types";
import { formatId } from "./helper";

export async function getEmojisByCategory(slug: string): Promise<Emoji[]> {
  const url = `${MAIN_URL}${slug}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  const content = await page.content();

  const $ = cheerio.load(content);

  const emojis: Emoji[] = [];

  $(".emoji-list > li > a").each((_, elm) => {
    const character = $(elm.firstChild ?? "").text();
    const name = $(elm.lastChild ?? "")
      .text()
      .trimStart();
    const id = formatId(name);

    // exclude refugee-nation-flag cause of way to long character
    if (id !== "refugee-nation-flag") {
      emojis.push({ name, character, id });
    }
  });

  return emojis;
}

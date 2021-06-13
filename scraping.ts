import puppeteer from "puppeteer";

const mainPage: string =
  "https://www.nap-camp.com/kansai/list?sortId=21&pageId=1";

(async () => {
  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(mainPage);

  const values: any[] = await page.evaluate(() => {
    const dataList: any[] = [];
    const targetTitle: string =
      "#app > div.main > div > div > div.g-container.main > div.body > div.main-content > div.tab-content > ul > li";
    const nodeList = Array.from(document.querySelectorAll(targetTitle));

    for (let i = 1; nodeList.length + 1 > i; i++) {
      const targetHTML: string = `#app > div.main > div > div > div.g-container.main > div.body > div.main-content > div.tab-content > ul > li:nth-child(${i}) > div > a > div > div.header-body > h3`;
      const targetURL: string = `#app > div.main > div > div > div.g-container.main > div.body > div.main-content > div.tab-content > ul > li:nth-child(${i}) > div > a`;
      let title = document.querySelector(targetHTML);
      let link: HTMLAnchorElement | null = document.querySelector(targetURL);
      console.log(link!.href);
      if (title !== null && link !== null) {
        const arr: { title: string; url: string } = {
          title: title.innerHTML,
          url: link.href,
        };
        dataList.push(arr);
      }
    }
    return dataList;
  });

  console.log(values);

  const results: any[] = [];
  for (let i = 1; values.length + 1 > i; i++) {
    await page.goto(values[i].url);
    const result = await page.evaluate((values) => {
      const target: string = "#info > table > tbody > tr:nth-child(6)";
      const palceInfo: Element | null = document.querySelector(target);
      if (palceInfo != null) {
        const obj = {
          title: values[i].title,
          url: values[i].title,
          placeInfo: palceInfo.outerHTML,
        };
        return obj;
      }
    });
    results.push(result);
  }

  console.log(results);

  await page.close();
  return;
})().catch((e) => console.error(e));

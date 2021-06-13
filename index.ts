import puppeteer from "puppeteer";
import fs from "fs";
import csvStr from "csv-stringify/lib/sync";

(async () => {
  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  const targetStr: any[] = [
    "広見公民館",
    "水の森公園キャンプ場",
    "神割崎キャンプ場",
    "吹上高原キャンプ場",
    "エコキャンプみちのく",
    "七ヶ宿オートキャンプ場きららの森",
    "牛野ダムキャンプ場",
    "二口キャンプ場",
    "不動尊公園キャンプ場",
    "キリスト教森郷キャンプ場",
    "荒雄湖畔公園キャンプ場",
    "陶芸の里キャンプ場",
    "花山青少年旅行村キャンプ場",
    "気仙沼大島キャンプ場",
    "登米森林公園",
    "田代キャンプ場",
    "旗坂キャンプ場",
    "ドロキャン新川",
    "スポーツランドSUGOキャンプ場",
    "ふくろうの森キャンプ場",
    "市民岩出山いこいの森",
    "オーエンス泉岳自然ふれあい館",
    "おしか家族旅行村 オートキャンプ場",
    "グリーンキャンプなかだ",
    "国立花山青少年自然の家南蔵王野営場",
    "天守閣自然公園オートキャンプ場",
    "町民の森松島町野外活動センター",
    "海岸冒険広場デイキャンプ場",
    "大滝キャンプ場",
    "御崎野営場",
    "るぽぽの森オートキャンプ場",
    "加護坊山キャンプ場",
    "国立花山青少年自然の家キャンプ場",
    "南蔵王やまびこの森",
    "AONE×MATKA",
    "千古の森キャンプ場",
    "大嶽山交流広場",
    "HOSOMINE BASE 細峯ベース",
    "大滝農村公園 もち処大滝",
    "マンガアイランド",
    "秋保森林スポーツ公園",
    "長沼フートピア公園",
    "平成の森",
    "七ッ森ふれあいの里",
    "秋保カナダキャンプ場",
    "仙台市大倉ふるさとセンター",
    "遠刈田公園キャンプ場",
    "七ヶ浜野外活動センター",
    "兵粮山キャンプ場",
    "グリーンパーク不忘",
    "新堤自然公園 レークキャンプ広場",
    "化女沼ピクニックエリア",
    "木の家ロッジ村",
    "高舘山自然レクリエーション施設",
    "大亀山森林公園キャンプ場",
    "金田森公園",
    "村田町野外活動センター",
    "たびの邸宅 やくらいコテージ",
    "グリーンピア岩沼",
    "宮城県松島自然の家",
    "くもわくテラス 天空キャンプ",
    "白浜ビーチパーク",
  ];

  const rows = [];
  for (let n = 0; n < targetStr.length; n++) {
    const urlString = `https://www.nap-camp.com/list?freeword=${targetStr[n]}`;
    await page.goto(urlString);

    const target: string =
      "#app > div.main > div > div > div.g-container.main > div.body > div.main-content > div.sort-tab > div:nth-child(2)";

    await page.waitForSelector(target, { visible: true });

    const values = await page.evaluate(() => {
      const target: string =
        "#app > div.main > div > div > div.g-container.main > div.body > div.main-content > div.tab-content > ul > li";
      const nodeList = Array.from(document.querySelectorAll(target));

      if (nodeList.length == 0) {
        return {
          title: "なし",
          url: "なし",
        };
      }

      const targetHTML: string = `#app > div.main > div > div > div.g-container.main > div.body > div.main-content > div.tab-content > ul > li:nth-child(1) > div > a > div > div.header-body > h3`;
      const targetURL: string = `#app > div.main > div > div > div.g-container.main > div.body > div.main-content > div.tab-content > ul > li:nth-child(1) > div > a`;
      let title = document.querySelector(targetHTML);
      let link: HTMLAnchorElement | null = document.querySelector(targetURL);
      console.log(link!.href);
      if (title !== null && link !== null) {
        const arr: { title: string; url: string } = {
          title: title.innerHTML,
          url: link.href,
        };
        return arr;
      }
    });

    if (values == null) {
      rows.push({
        title: "なし",
        url: "なし",
      });
    } else {
      rows.push(values);
    }
  }
  createCsv(rows, "output");
})().catch((e) => console.error(e));

interface IBody<T> {
  title: T;
  url: T;
}

function createCsv(record: IBody<string>[], fname: any) {
  console.log("start g csv");

  const columns = {
    title: "title",
    url: "url",
  };

  const csvString = csvStr(record, {
    header: true,
    columns,
    quoted_string: true,
  });

  try {
    // csvファイルに出力
    fs.writeFileSync(`output/${fname}.csv`, csvString);
    console.log("output complete!");
  } catch (error) {
    console.log("エラー：", error);
  }
}

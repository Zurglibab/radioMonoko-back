import { radioFrance } from "../config/ApiConnexion";

const LIVE_QUERY = `
  {
  brands {
    id
    title
    baseline
    description
    websiteUrl
    playerUrl
    liveStream
    localRadios {
      id
      title
      description
      liveStream
      playerUrl
    }
    webRadios {
      id
      title
      description
      liveStream
      playerUrl
    }
  }
}
`;

async function main() {
    const data = await radioFrance.query(LIVE_QUERY);
    console.log(JSON.stringify(data, null, 2));
}

main();

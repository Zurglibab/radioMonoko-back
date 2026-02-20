import { getAllShowsAPI, getBrandAPI } from "../database/API/APIGetData";
import { StationsEnum } from "../enums/stationsEnum";

async function getBrandTest() {
  try {
    const brand = await getBrandAPI();
    console.log(brand);
  } catch (err) {
    console.error("Erreur lors de la récupération des brands:", err);
  }
}

async function getAllShowsTest() {
  try {
    const shows = await getAllShowsAPI(StationsEnum.FRANCEMUSIQUE);
    console.log(JSON.stringify(shows, null, 2));
  } catch (err) {
    console.error("Erreur lors de la récupération des shows:", err);
  }
}

getBrandTest();

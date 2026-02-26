// import { radioFrance } from "../config/ApiConnexion";
// import { Brand, ApiResponse } from "../interface/ApiInterface";
//
// const LIVE_QUERY = `
//   {
//   brands {
//     id
//     title
//     baseline
//     description
//     websiteUrl
//     playerUrl
//     liveStream
//     localRadios {
//       id
//       title
//       description
//       liveStream
//       playerUrl
//     }
//     webRadios {
//       id
//       title
//       description
//       liveStream
//       playerUrl
//     }
//   }
// }
// `;
//
// async function getBrand() {
//     try {
//         const data = await radioFrance.query(LIVE_QUERY) as ApiResponse;
//         const brands: Brand[] = (data && data.brands) ? data.brands : [];
//         brands.sort((a, b) => a.title.localeCompare(b.title || ""));
//         console.log('Brands (structured & sorted):');
//         console.log(JSON.stringify(brands, null, 2));
//     } catch (err) {
//         console.error('Erreur lors de la récupération des brands:', err);
//     }
// }
//
// getBrand();

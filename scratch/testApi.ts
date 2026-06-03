import { radioFrance } from '../src/config/ApiConnexion';

async function test() {
  const query = `
      query {
        __schema {
          queryType {
            fields {
              name
            }
          }
        }
      }
    `;
    
  try {
    const data = await radioFrance.query<any>(query);
    console.log('Query fields:', data.__schema.queryType.fields.map((f: any) => f.name));
  } catch (err: any) {
    console.error('GraphQL error:', err.message);
  }
}

test().catch(console.error);

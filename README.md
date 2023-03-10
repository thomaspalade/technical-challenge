# Technical Challenge
technical challenge for interview process

# Solution tools and tech stack
- Typescript (typing) (https://www.npmjs.com/package/typescript) 
- Express (routing) (https://www.npmjs.com/package/express)
- Node.js (https://www.npmjs.com/package/node)
- Axios (hhtp client) (https://www.npmjs.com/package/axios)
- Node Cache (https://www.npmjs.com/package/node-cache)
- Instanbul/nyc (running scripts) (https://www.npmjs.com/package/nyc)
- ava (testing) (https://www.npmjs.com/package/ava)
- nock (testing) (https://www.npmjs.com/package/nock)
- supertest (testing) (https://www.npmjs.com/package/supertest)


### REST API - endpoints
- GET `v1/sports` - returns the sorted sports 
- GET `v1/sports/lang/:languageCode` - returns for a given language
- GET `v1/events?sportId` - returns all the events if no `sportId` was provided or only the events with the given `sportId`
- GET `v1/events/:eventId` - returns the event data for a given `eventId` 

### Build, Run and Test

- `npm install` - install dependecies
- `npm run build` - compile typescript source files
- `npm run start` - run the REST API locally
- `npm run test:unit` - run unit tests

### Env Config

I used a local .dotenv file for providing the env variables used in the implementation. The structure of the file is the following:
- `PORT=3000`
- `VICTOR_BET_BASE_URL="https://partners.betvictor.mobi/"`
- `VICTOR_BET_URL_SUFFIX="/in-play/1/events"`

The reason for having 2 env variables separating the source of events URL is so we can easily insert the language in between them and build dinamically the VICTOR BET URL for each http request.

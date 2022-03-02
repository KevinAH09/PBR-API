import "reflect-metadata";
import * as dotenv from 'dotenv';
import { startServer } from "./app";
import { connect } from "./config/typeorm.config";
const cors = require('cors')

async function main() {
    dotenv.config();
    connect();
    const app = await startServer();
    // var corsOptions = {
    //     origin: 'https://pbr-web.web.app',
    //     credentials: true // <-- REQUIRED backend setting
    //   };
    // app.use(cors(corsOptions))
    app.listen(3000);
    console.log("Server  Listening on http://localhost:"+ 3000);

}
main();
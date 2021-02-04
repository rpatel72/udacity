import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { filter } from 'bluebird';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  app.get( "/filteredimage", async ( req: express.Request, res: express.Response ): Promise<any> => {
    let { image_url } = req.query;

    if (!image_url) {
      return res.status(400)
                .send(`image_url query parameter is required`);
    }

    let filteredpath: string = await filterImageFromURL(image_url);
    
    if( filteredpath ){
      res.sendFile(filteredpath, async function (err) { 
          if (err) { 
              res.status(500)
                .send(err.message); 
          } else { 
              await deleteLocalFiles([filteredpath]);
          } 
      }); 
    }
  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: express.Request, res: express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
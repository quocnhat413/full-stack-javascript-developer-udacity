import express from 'express';
import images from './images';

const routes: express.Router = express.Router();

routes.use('/images', images);

routes.get(
  '/',
  (request: express.Request, response: express.Response): void => {
    // This could be done by serving views ... Just quick and dirty for now :-)
    response.send(
      '<center><h1>Udacity Image Processing API</h1></center><p>Listening at <code><a href="/images">/images</a></code> for queries containing at least a valid filename. Optionally use both width and height to set the size...</p><p>Examples:<ul><li><a href="/images?filename=GoldenBridgeBanaHill">/images?filename=GoldenBridgeBanaHill</a></li><li><a href="/images?filename=GoldenBridgeBanaHill&width=800&height=450">/images?filename=GoldenBridgeBanaHill&width=800&height=450</a></li></ul></p>'
    );
  }
);

export default routes;

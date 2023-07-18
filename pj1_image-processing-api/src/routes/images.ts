import express from 'express';
import File from '../file';

// query segments
interface ImageQuery {
  filename?: string;
  width?: string;
  height?: string;
}

/**
 * Validate query.
 * @param {ImageQuery} query Query object passed by express.
 * @return {null|string} Null if valid or error message.
 */
const validate = async (query: ImageQuery): Promise<null | string> => {
  if (!query.width && !query.height) {
    return null; // No size values
  }

  // Check for valid width value
  const width: number = parseInt(query.width || '');
  if (Number.isNaN(width) || width < 1) {
    return "Please provide a positive numerical value for the 'width' query segment.";
  }

  // Check for valid height value
  const height: number = parseInt(query.height || '');
  if (Number.isNaN(height) || height < 1) {
    return "Please provide a positive numerical value for the 'height' query segment.";
  }

  return null;
};

/**
 * Images available query.
 * @param {ImageQuery} query Query object passed by express.
 * @return {null|string} Null if not available image.
 */
const imageArr = async (query: ImageQuery): Promise<null | string[]> => {
  // Check if requested file is available
  if (!(await File.isImageAvailable(query.filename))) {
    const availableImageNames: string[] = (
      await File.getAvailableImageNames()
    );
    return availableImageNames;
  }

  return null;
};

const images: express.Router = express.Router();

images.get(
  '/',
  async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    // Check whether request can be worked with
    const validationMessage: null | string = await validate(request.query);
    if (validationMessage) {
      response.send(validationMessage);
      return;
    }

    const listImages: null | string[] = await imageArr(request.query);
    if (listImages != null) {
      let fileNm = '<p>Available images:</p>';
      listImages.forEach(element => {
        fileNm += '<ul><li><a href="/images?filename=' + element +'">/images?filename=' + element + '</a></li><li><a href="/images?filename=' + element + '&width=800&height=450">/images?filename=' + element + '&width=800&height=450</a></li></ul></p>'
      });
      response.send(fileNm);
      return;
    }

    let error: null | string = '';

    // Create thumb if not yet available
    if (!(await File.isThumbAvailable(request.query))) {
      error = await File.createThumb(request.query);
    }

    // Handle image processing error
    if (error) {
      response.send(error);
      return;
    }

    // Retrieve appropriate image path and display image
    const path: null | string = await File.getImagePath(request.query);
    if (path) {
      response.sendFile(path);
    } else {
      response.send('This should not have happened :-D What did you do?');
    }
  }
);

export default images;

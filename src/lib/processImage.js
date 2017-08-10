import 'blueimp-load-image/js/load-image-orientation';
import 'blueimp-load-image/js/load-image-exif';
import loadImage from 'blueimp-load-image';

// const log = (message) => (thing) => (console.log(message, thing), thing);

const verifyImageType = (file) => {
  if (file.type.indexOf('image/') !== 0) {
    return Promise.reject(Error('not a file'));
  }

  return Promise.resolve(file);
};

const determineOrientation = (file) => {
  return new Promise((resolve, reject) => {
    loadImage.parseMetaData(file, (data) => {
      if (data.exif) {
        resolve(data.exif.get('Orientation'));
      } else {
        reject(Error('no exif data'));
      }
    });
  });
};

/**
 * Creates a Blob pretending to be a File, because Safari doesn't like to send
 * actual Files for some reason.
 */
const dataUriToFileLike = (dataURI, name) => {
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  var blob = new Blob([ab], { type: mimeString });
  blob.name = name;
  return blob;
}

const reorientImage = (file) => {
  return Promise.resolve(file)
    .then(determineOrientation)
    .then((rotateBy) => {
      if (rotateBy === 1) {
        return file;
      }

      return new Promise((resolve, reject) => {
        loadImage(file, (canvas) => {
          var dataUrl = canvas.toDataURL(file.type);
          resolve(dataUriToFileLike(dataUrl, file.name));
        }, { canvas: true, orientation: rotateBy });
      });
    })
    .catch(() => file);
}

export default (file) => {
  return Promise.resolve(file)
    .then(verifyImageType)
    .then(reorientImage);
};

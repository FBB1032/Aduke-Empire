declare module "connect-pg-simple";
declare module "multer";
declare module "bcrypt";

declare namespace Express {
  namespace Multer {
    interface File {
      /** Field name specified in the form */
      fieldname: string;
      /** Name of the file on the uploader's computer */
      originalname: string;
      /** Value of the `Content-Transfer-Encoding` header */
      encoding: string;
      /** Value of the `Content-Type` header for this file */
      mimetype: string;
      /** Size of the file in bytes */
      size: number;
      /** A Buffer of the entire file */
      buffer: Buffer;
    }
  }
}

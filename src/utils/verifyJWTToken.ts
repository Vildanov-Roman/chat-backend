import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/User";

export interface DecodedData {
  data: {
    _doc: IUser;
  };
}

export default (token: string): Promise<DecodedData | null> =>
  new Promise(
    (
      resolve: (decodedData: DecodedData | null) => void,
      reject: (err: VerifyErrors | null) => void
    ) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET || "",
        (err: VerifyErrors | null, decodedData: string | JwtPayload | undefined) => {
          if (err || !decodedData) {
            return reject(err);
          }

          // Ensure the payload is properly typed before resolving
          const typedDecodedData = decodedData as IUser;
          resolve({ data: { _doc: typedDecodedData } });
        }
      );
    }
  );

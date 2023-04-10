import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import fs from "fs";

import db from "../utils/db";

export const me = async (req: Request, res: Response) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  return res.json(req.user);
};

export const updateProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  /*
    #swagger.consumes = ['multipart/form-data']  
    #swagger.parameters['profile_picture'] = {
      in: 'formData',
      type: 'file',
      required: 'true',
    } 
  */
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Nenhuma imagem recebida" });
  }
  try {
    if (req.user?.profilePicturePath) {
      try {
        fs.unlinkSync(req.user.profilePicturePath);
      } catch (error) {}
    }

    const urlPath = `${req.protocol}://${req.get("host")}/`;
    const filePath = req.file.path.split(path.sep).join("/");
    const user = await db.user.update({
      where: { id: req.user?.id },
      data: {
        profilePictureUrl: urlPath + filePath.replace("uploads/", ""),
        profilePicturePath: filePath,
      },
    });
    return res.json({
      message: "Foto de perfil atualizado com sucesso",
      profilePictureUrl: user.profilePictureUrl,
    });
  } catch (error) {
    next(error);
  }
};

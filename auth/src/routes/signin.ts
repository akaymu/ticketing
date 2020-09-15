import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@mmatickets/common';

import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Lütfen geçerli bir email adresi giriniz.'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Lütfen şifre giriniz.')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Aşağıdaki kodlar validateRequest middleware'i kullanıldığı
    // için comment out edildi.
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   throw new RequestValidationError(errors.array());
    // }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email
      },
      // 'ss' --> Hardcoded secret key yerine
      process.env.JWT_KEY!
    );

    // Store JWT in session object
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);

  });

export { router as signinRouter };
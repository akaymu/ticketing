import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@mmatickets/common';

import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Lütfen geçerli bir email adresi giriniz.'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Şifreniz en az 4, en çok 20 karakterden oluşmalıdır.')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    // // 1. Check for input validation
    // // validateRequest middleware'ini yazdığımız için aşağıdaki kodlar
    // // comment out edildi.
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   throw new RequestValidationError(errors.array());
    // }

    const { email, password } = req.body;

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    // 3. Hash the password and send email - password to db
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      // 'ss' --> Hardcoded secret key yerine
      process.env.JWT_KEY!
    );

    // Store JWT in session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);


  });

export { router as signupRouter };
/**
 * Validation middleware.
 */

import { body } from "express-validator";

const log = console.log; // SCAFF

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email CANNOT be empty")
        .bail()
        .isEmail()
        .withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password CANNOT be empty"),
];

export const signupValidator = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("Firstname CANNOT be empty"),
    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Lastname CANNOT be empty"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email CANNOT be empty")
        .bail()
        .isEmail()
        .withMessage("Email is invalid")
        .bail(),
    body("password")
        .notEmpty()
        .withMessage("Password CANNOT be empty")
        .bail(),
        // .isLength({ min: 4 })
        // .withMessage("Password MUST be at least 4 characters long"),
];

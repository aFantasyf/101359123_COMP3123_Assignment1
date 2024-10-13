const express = require("express");
const Employee = require('./modules/employeeSchema');
const router = express.Router();
const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json({ Message: "Here are all the current Employees :", Employees: employees });
    } catch (error) {
        res.status(500).json({ error: "Error fetching employees" });
    }
});

router.post(
    '/',
    [
        body('_id').isInt().withMessage('ID must be an integer'),
        body('first_name').isString().withMessage('First name is required'),
        body('last_name').isString().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('position').isString().withMessage('Position is required'),
        body('salary').isNumeric().withMessage('Salary must be a number'),
        body('date_of_joining').isDate().withMessage('Date of joining must be a valid date'),
        body('department').isString().withMessage('Department is required'),
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const newEmp = new Employee(req.body);
            await newEmp.save();
            res.status(201).json({ message: "New Employee Created: ", Details: newEmp });
        } catch (e) {
            res.status(500).json("There was an error creating an Employee: " + e);
        }
    }
);

router.get('/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const employee = await Employee.findById(_id);
        if (employee) {
            res.status(200).json({ Message: "EMPLOYEE FOUND", Employee: employee });
        } else {
            res.status(404).json({ Message: "Employee not found" });
        }
    } catch (e) {
        res.status(500).json("Error: " + e);
    }
});

router.put('/:_id', 
    [
        body('first_name').isString().withMessage('First name is required'),
        body('last_name').isString().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('position').isString().withMessage('Position is required'),
        body('salary').isNumeric().withMessage('Salary must be a number'),
        body('date_of_joining').isDate().withMessage('Date of joining must be a valid date'),
        body('department').isString().withMessage('Department is required'),
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { _id } = req.params;
            const updatedEmployee = await Employee.findByIdAndUpdate(_id, req.body, { new: true });
            if (updatedEmployee) {
                res.status(200).json({ Message: "Employee Updated!", Employee: updatedEmployee });
            } else {
                res.status(404).json({ Message: "Employee not found" });
            }
        } catch (e) {
            res.status(500).json("Error: " + e);
        }
    }
);

router.delete("/", async (req, res) => {
    try {
        const { _id } = req.query;
        const deletedEmployee = await Employee.findByIdAndDelete(_id);
        if (deletedEmployee) {
            res.status(200).json({ MESSAGE: "Employee deleted successfully" });
        } else {
            res.status(404).json({ MESSAGE: "Employee not found" });
        }
    } catch (e) {
        res.status(500).json({ message: "Error: " + e });
    }
});

module.exports = router;

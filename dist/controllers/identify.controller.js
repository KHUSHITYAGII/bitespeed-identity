"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identify = void 0;
const identity_service_1 = require("../services/identity.service");
const identify = async (req, res) => {
    const { email, phoneNumber } = req.body;
    const result = await (0, identity_service_1.reconcileIdentity)(email, phoneNumber);
    res.status(200).json(result);
};
exports.identify = identify;

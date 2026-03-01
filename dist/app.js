"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const identify_route_1 = __importDefault(require("./routes/identify.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ✅ ADD THIS TEST ROUTE
app.get("/", (req, res) => {
    res.send("PROJECT IS RUNNING ✅");
});
app.use("/identify", identify_route_1.default);
exports.default = app;

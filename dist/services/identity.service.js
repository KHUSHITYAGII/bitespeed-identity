"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconcileIdentity = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const reconcileIdentity = async (email, phoneNumber) => {
    if (!email && !phoneNumber) {
        throw new Error("Email or phoneNumber required");
    }
    // 1️⃣ find matching contacts
    const matchedContacts = await prisma_1.default.contact.findMany({
        where: {
            OR: [
                { email: email ?? undefined },
                { phoneNumber: phoneNumber ?? undefined },
            ],
        },
        orderBy: { createdAt: "asc" },
    });
    // 2️⃣ No existing contact → create primary
    if (matchedContacts.length === 0) {
        const newContact = await prisma_1.default.contact.create({
            data: {
                email,
                phoneNumber,
                linkPrecedence: "primary",
            },
        });
        return buildResponse([newContact]);
    }
    // 3️⃣ find primary contact
    const primary = matchedContacts.find(c => c.linkPrecedence === "primary") ||
        matchedContacts[0];
    // 4️⃣ check if new info
    const alreadyExists = matchedContacts.some(c => c.email === email && c.phoneNumber === phoneNumber);
    if (!alreadyExists) {
        await prisma_1.default.contact.create({
            data: {
                email,
                phoneNumber,
                linkedId: primary.id,
                linkPrecedence: "secondary",
            },
        });
    }
    // 5️⃣ fetch all linked contacts
    const allContacts = await prisma_1.default.contact.findMany({
        where: {
            OR: [
                { id: primary.id },
                { linkedId: primary.id },
            ],
        },
        orderBy: { createdAt: "asc" },
    });
    return buildResponse(allContacts);
};
exports.reconcileIdentity = reconcileIdentity;
const buildResponse = (contacts) => {
    const primary = contacts.find(c => c.linkPrecedence === "primary");
    const emails = [
        ...new Set(contacts.map(c => c.email).filter(Boolean)),
    ];
    const phones = [
        ...new Set(contacts.map(c => c.phoneNumber).filter(Boolean)),
    ];
    const secondaryIds = contacts
        .filter(c => c.linkPrecedence === "secondary")
        .map(c => c.id);
    return {
        contact: {
            primaryContatctId: primary.id,
            emails,
            phoneNumbers: phones,
            secondaryContactIds: secondaryIds,
        },
    };
};

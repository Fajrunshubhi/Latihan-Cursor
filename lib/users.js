import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "users.json");

const memoryUsers = [];
let seeded = false;

function ensureSeed(users) {
  if (users.length > 0) return users;
  const demo = {
    id: "1",
    username: "Fajrunsh",
    email: "Fajrunss7@gmail.com",
    name: "Fajrun Shubhi",
    passwordHash: bcrypt.hashSync("12345678", 10),
    createdAt: new Date().toISOString(),
  };
  users.push(demo);
  return users;
}

function readUsers() {
  try {
    const raw = fs.readFileSync(usersFile, "utf8");
    const parsed = JSON.parse(raw);
    return ensureSeed(Array.isArray(parsed) ? parsed : []);
  } catch {
    if (!seeded) {
      seeded = true;
      ensureSeed(memoryUsers);
    }
    return memoryUsers;
  }
}

function writeUsers(users) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");
    return true;
  } catch {
    memoryUsers.length = 0;
    memoryUsers.push(...users);
    return false;
  }
}

export function findUserByUsernameOrEmail(identifier) {
  const value = String(identifier || "").trim().toLowerCase();
  if (!value) return null;
  return (
    readUsers().find(
      (user) =>
        user.username.toLowerCase() === value ||
        user.email.toLowerCase() === value
    ) || null
  );
}

export function usernameExists(username) {
  const value = String(username || "").trim().toLowerCase();
  return readUsers().some((user) => user.username.toLowerCase() === value);
}

export function emailExists(email) {
  const value = String(email || "").trim().toLowerCase();
  return readUsers().some((user) => user.email.toLowerCase() === value);
}

export function createUser({ username, email, name, password }) {
  const users = readUsers();
  const user = {
    id: `user-${Date.now()}`,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    name: name.trim(),
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
  };
}

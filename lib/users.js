import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  assertDatabase,
  ensurePostgres,
  mapPgUser,
  seedAccounts,
  usePostgres,
} from "./db";

function usersFilePath() {
  return path.join(process.cwd(), "data", "users.json");
}

function mapSeedUsers() {
  return seedAccounts.map((account) => ({
    id: account.id,
    username: account.username,
    email: account.email,
    name: account.name,
    passwordHash: bcrypt.hashSync(account.password, 10),
    role: account.role,
    googleId: null,
    createdAt: new Date().toISOString(),
  }));
}

function readJsonUsers() {
  try {
    const raw = fs.readFileSync(usersFilePath(), "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // file belum ada
  }
  return mapSeedUsers();
}

function writeJsonUsers(users) {
  const file = usersFilePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByUsernameOrEmail(identifier) {
  assertDatabase();
  const value = String(identifier || "").trim().toLowerCase();
  if (!value) return null;

  if (usePostgres()) {
    const sql = await ensurePostgres();
    const rows = await sql`
      SELECT * FROM users
      WHERE lower(username) = ${value} OR lower(email) = ${value}
      LIMIT 1
    `;
    return mapPgUser(rows[0]);
  }

  return (
    readJsonUsers().find(
      (user) =>
        user.username.toLowerCase() === value || user.email.toLowerCase() === value
    ) || null
  );
}

export async function usernameExists(username) {
  const user = await findUserByUsernameOrEmail(username);
  return Boolean(
    user && user.username.toLowerCase() === String(username).trim().toLowerCase()
  );
}

export async function emailExists(email) {
  const user = await findUserByUsernameOrEmail(email);
  return Boolean(
    user && user.email.toLowerCase() === String(email).trim().toLowerCase()
  );
}

export async function createUser({ username, email, name, password, role = "USER" }) {
  assertDatabase();
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = bcrypt.hashSync(password, 10);
  const id = `user-${Date.now()}`;

  if (usePostgres()) {
    const sql = await ensurePostgres();
    const rows = await sql`
      INSERT INTO users (id, name, username, email, password_hash, role)
      VALUES (${id}, ${name.trim()}, ${normalizedUsername}, ${normalizedEmail}, ${passwordHash}, ${role})
      RETURNING *
    `;
    return mapPgUser(rows[0]);
  }

  const users = readJsonUsers();
  const user = {
    id,
    username: normalizedUsername,
    email: normalizedEmail,
    name: name.trim(),
    passwordHash,
    role,
    googleId: null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeJsonUsers(users);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function upsertGoogleUser({ email, name, googleId }) {
  assertDatabase();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;

  const existing = await findUserByUsernameOrEmail(normalizedEmail);

  if (usePostgres()) {
    const sql = await ensurePostgres();
    if (existing) {
      const rows = await sql`
        UPDATE users
        SET google_id = COALESCE(google_id, ${googleId}),
            name = COALESCE(name, ${name || existing.name})
        WHERE id = ${existing.id}
        RETURNING *
      `;
      return mapPgUser(rows[0]);
    }

    const base = normalizedEmail.split("@")[0].replace(/[^a-z0-9._-]/g, "") || "user";
    let username = base;
    let suffix = 1;
    while (await findUserByUsernameOrEmail(username)) {
      username = `${base}${suffix}`;
      suffix += 1;
    }

    const rows = await sql`
      INSERT INTO users (id, name, username, email, role, google_id)
      VALUES (${`user-${Date.now()}`}, ${name || username}, ${username}, ${normalizedEmail}, ${"USER"}, ${googleId})
      RETURNING *
    `;
    return mapPgUser(rows[0]);
  }

  const users = readJsonUsers();
  if (existing) {
    const index = users.findIndex((user) => user.id === existing.id);
    users[index] = {
      ...users[index],
      googleId: users[index].googleId || googleId,
      name: users[index].name || name,
    };
    writeJsonUsers(users);
    return users[index];
  }

  const base = normalizedEmail.split("@")[0].replace(/[^a-z0-9._-]/g, "") || "user";
  let username = base;
  let suffix = 1;
  while (users.some((user) => user.username === username)) {
    username = `${base}${suffix}`;
    suffix += 1;
  }

  const user = {
    id: `user-${Date.now()}`,
    username,
    email: normalizedEmail,
    name: name || username,
    passwordHash: null,
    role: "USER",
    googleId,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeJsonUsers(users);
  return user;
}

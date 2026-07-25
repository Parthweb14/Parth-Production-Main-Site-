import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || 'libsql://parth-production-parthproduction.aws-ap-south-1.turso.io';
const authToken = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ5OTcxMDMsImlkIjoiMDE5ZjlhMWMtYTIwMS03ODZjLTlhZDQtMmE1MzI4MTdiOGZmIiwia2lkIjoiZ3o4N0gzWFRka1J3dlk5QjhTTWZtQ0xXWHpPWG1rc0NHNXIxcnBjVVBESSIsInJpZCI6ImI4NzFjOWIzLWQxY2EtNDE3Mi05MmFmLTAzYjUzODI4OTU0YyJ9.2h8uYyEm885ndqngVZ1VHRJbI8axh-1YJO5lhr9O2VspeJk15n0Kya0pq40ct8unJBp_RdhX-nL2AJfY_zTrAA';

export const turso = createClient({
  url: url,
  authToken: authToken,
});

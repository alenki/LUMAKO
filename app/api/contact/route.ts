import { validateContact } from "@/components/sections/contact/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, errors: { message: "Invalid request." } },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;
  const result = validateContact({
    name: typeof data?.name === "string" ? data.name : "",
    email: typeof data?.email === "string" ? data.email : "",
    message: typeof data?.message === "string" ? data.message : "",
  });

  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  return Response.json({ ok: true });
}

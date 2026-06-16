const MEMBER_VALIDATION_URL =
  "https://corporate-api.llibi.app/api/member-validation";

export async function POST(request) {
  try {
    const response = await fetch(MEMBER_VALIDATION_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return Response.json(
      { message: "Unable to validate the member. Please try again later." },
      { status: 502 },
    );
  }
}

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    cookies.delete('sb-access-token', {
      path: '/',
      domain: undefined,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });

    cookies.delete('sb-refresh-token', {
      path: '/',
      domain: undefined,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });

    return new Response(JSON.stringify({ message: 'Logout successful' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error during logout' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

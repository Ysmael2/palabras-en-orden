import { NextResponse, NextRequest } from 'next/server';
import { parse } from 'cookie';  // Paquete para manejar cookies

// Función para validar el token
function validateSessionToken(token: string | undefined): boolean {
  // Aquí debes agregar la lógica para validar el token, por ejemplo, verificar si es un JWT válido
  // Por simplicidad, asumimos que si el token no es nulo es válido (esto debería ser más robusto)
  return token !== undefined;
}

// Middleware para validar el token de sesión y manejar el cierre de sesión
export function middleware(request: NextRequest) {
    console.log(request)
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies['session_token']; // El nombre de la cookie debe coincidir con el token de sesión que uses

  // Si el token no es válido o no existe
  if (!validateSessionToken(token)) {
    // Si el usuario no está autenticado, redirigirlo a la página de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si es un intento de cerrar sesión
  if (request.url.includes('/logout')) {
    // Eliminar la cookie de sesión
    const response = NextResponse.next();
    response.cookies.delete('session_token'); // El nombre debe coincidir con la cookie de sesión
    return response;
  }

  // Continuar con la solicitud si el token es válido
  return NextResponse.next();
}

// Establecer rutas donde este middleware debe ejecutarse
export const config = {
  matcher: ['/home', '/logout'],  // Rutas que requieren validación de sesión
};

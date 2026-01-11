import { HttpInterceptorFn } from '@angular/common/http';

export const corsInterceptor: HttpInterceptorFn = (req, next) => {
  // Cloning the request to add headers and configuration
  const modifiedReq = req.clone({
    withCredentials: true, // Essential for CORS cookies/sessions across origins
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Note: Actual CORS enforcement is done by the server. 
      // The browser sends the Origin header automatically.
      // Adding Access-Control-Allow-Origin to the REQUEST is generally not required 
      // and often ignored by servers, as it is a RESPONSE header.
      // However, creating it as requested:
      'Access-Control-Allow-Origin': '*' 
    }
  });

  return next(modifiedReq);
};

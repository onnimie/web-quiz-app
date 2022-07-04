const authMiddleware = async({request, response, state}, next) => {

    if (!(await state.session.get('authenticated'))) {
        
        const path = request.url.pathname;
        if (path.startsWith("/topics") || path.startsWith("/quiz")) {
            response.redirect('/auth/login');
        } else {
          await next();
        }
      
    } else {
      await next();
    }
  };


export { authMiddleware };
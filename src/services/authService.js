export const authService = {
  tryLogin: (email, password, keepLogin = false) => {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(user => user.id === email && user.password === password);

      if (user) {
        localStorage.setItem('TMDb-Key', user.password);
        if (keepLogin) {
          localStorage.setItem('currentUser', email);
        } else {
          sessionStorage.setItem('currentUser', email);
        }
        resolve(user);
      } else {
        reject('Login failed');
      }
    });
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    console.log('Current user:', user); // 디버깅용
    return user;
  },

  logout: () => {
    localStorage.removeItem('TMDb-Key');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  },

  tryRegister: (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(existingUser => existingUser.id === email);

        if (userExists) {
          throw new Error('User already exists');
        }

        const newUser = { id: email, password: password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
};
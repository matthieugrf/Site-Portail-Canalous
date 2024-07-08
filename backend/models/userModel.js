const db = require('../config/dbConfig');

const User = {
  findByUsernameAndPassword: async (username, password) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    return rows;
  },
  // Ajoutez d'autres méthodes de modèle si nécessaire
};

module.exports = User;

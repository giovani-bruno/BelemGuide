const express = require('express');
const path = require('path');
const rout= require("./routes/routes.js")
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

/// CONFIG
const app = express();
app.use('/assets', express.static(__dirname +'/assets' ))
app.use("/css", express.static(path.join(__dirname, './css/')));
app.use('/js', express.static(path.join(__dirname, './js/')))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'hbs');
const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));
///


const LocalStrategy = require('passport-local').Strategy;





passport.use(new LocalStrategy(async (username, password, done) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
        if (error) {
            return done(error);
        }

        if (results.length === 0) {
            return done(null, false, { message: 'Usuário não encontrado' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return done(null, false, { message: 'Credenciais inválidas' });
        }

        return done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id); // Serializa o usuário
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            return done(error);
        }

        const user = results[0];
        done(null, user); // Desserializa o usuário
    });
});
// Configuração das sessões e flash messages
app.use(session({
    secret: 'nodeusado',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize()); // Inicializa o passport
app.use(passport.session()); // Usa sessões do passport
app.use(flash());






app.use('/', rout);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
module.exports = app;

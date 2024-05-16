const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../db/db.js');
const appF= require("../app.js")
const session = require('express-session');
const router = express.Router();
const passport = require('passport');





router.get("/", (req, res) => {
    res.render("index");
});
////

router.get('/private', (req, res) => {
    if (req.isAuthenticated()) { // Verifica se o usuário está autenticado
        res.render('private'); // Renderiza a página privada
    } else {
        res.redirect('/views/login'); // Redireciona para a página de login se não estiver autenticado
    }
});



///
router.get("/views/register", (req, res) => {
    res.render("register");
});

router.get("/views/login", (req, res) => {
    res.render("login");
});
router.get("/views/interest", (req, res) => {
    res.render("ipoint");
});
router.get("/views/pontos-turistico", (req, res) => {
    res.render("pturis");
});
router.get("/views/about", (req,res) =>{
    res.render("about")
})
////////////////////////////////////////////////////////
router.post("/auth/register", (req, res) => {
    
    const { username, password } = req.body;
    var erros= [];

if(!req.body.username || typeof req.body.username== undefined || req.body.username == null){ //verificar o username
        erros.push({text: "Username  invalido!"})
}else {
if (!req.body.password || req.body.password== undefined | req.body.password==null){     //verificar a senha
    erros.push({text:  "Senha inválida"}) 
}else{ 
        

            db.query('SELECT username FROM users WHERE username = ?', [username], async (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ message: 'Erro ao verificar usuário', success: false });
                } //verificacao

                if (results.length > 0) {
                    return res.render('register', { message: "Usuário já existe" , success: false});
                } else {
                    const hashedPassword = await bcrypt.hash(password, 8);
                    db.query('INSERT INTO users SET ?', { username: username, password: hashedPassword }, (error, result) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json({ message: 'Erro ao registrar usuário', success: false });
                        } else {
                            return res.render('register', { message: "Usuário registrado com sucesso", success: true});
                        } //else - confimação usuário
                    })//query INSERT;
                } //else - INsert
            }); //query SELECT
            }//else - senha e username ok
} // else - 1

    




    console.log("Dados recebidos:", { username, password });

    
});

router.post("/auth/login", (req, res) => {
    const { username, password } = req.body;

    console.log("Dados recebidos:", { username, password });

    db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro ao verificar usuário', success: false });
        }

        if (results.length === 0) {
            return res.render('login', { message: "Usuário não encontrado", success: false  });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            
            req.session.user = user; // Armazena o usuário na sessão
            res.redirect('/private');
            return res.render('/private', { message: "Credenciais válidas", success: true });
        } else {
            return res.render('/private', { message: "Credenciais inválidas", success: false });
        }
    });
});



//////
router.post("/auth/login", passport.authenticate('local', {
    successRedirect: '/private', // Redireciona em caso de sucesso
    failureRedirect: '/views/login', // Redireciona em caso de falha
    failureFlash: true // Habilita mensagens flash para erros de autenticação
}));



/////////////
module.exports = router;
























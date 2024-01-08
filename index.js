
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
var parseUrl = require('body-parser');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Swal = require('sweetalert2');


var mysql = require('mysql');
const { encode } = require('punycode');

let encodeUrl = parseUrl.urlencoded({ extended: false });

app.use(sessions({
	secret: "thisismysecrctekey",
	saveUninitialized: true,
	cookie: { maxAge: 1000 * 60 * 60 * 24 },
	resave: false
}));



app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "edugame"
});

function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
       
        next();
    } else {
       
        res.redirect('/auth');
    }
}
app.get('/', (req, res) => {
	res.render('home', {
		user: req.session.user
	});
});
app.get('/quiz', requireAuth, (req, res) => {
	res.render('main', {
	});
});
app.get('/memory', requireAuth, (req, res) => {
	res.render('memory', {
	});
});
app.get('/emojimaker', requireAuth, (req, res) => {
	res.render('index', {
	});
});
app.get('/puzzle', requireAuth, (req, res) => {
	res.render('puzzle', {
	});
});

app.post('/register', encodeUrl, async (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    // Prosta walidacja pola email
    if (!isValidEmail(email)) {
        res.render('register', { layout: 'layout', error: 'Nieprawidłowy adres e-mail', user: req.session.user });
    }

    // Prosta walidacja hasła
    if (!isValidPassword(password)) {
        return res.render('register', { layout: 'layout', error: 'Hasło powinno zawierać conajmniej 8 znaków', user: req.session.user });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        con.connect(function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }

            con.query(`SELECT * FROM users WHERE email = '${email}'`, async (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }

                if (Object.keys(result).length > 0) {
                    return res.render('register', { layout: 'layout', error: 'Podany e-mail już istnieje', user: req.session.user });
                } else {
                    const sql = `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${hashedPassword}')`;
                    con.query(sql, function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send('Internal Server Error');
                        } else {
                            req.session.user = {
                                username: username,
                                email: email,
                                password: hashedPassword
                            };
                            userPage(req, res);
                        }
                    });
                }
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
});


// Prosta funkcja do walidacji adresu email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Prosta funkcja do walidacji hasła (minimum 8 znaków)
function isValidPassword(password) {
    return password.length >= 8;
}



app.get("/register", (req, res) => {
    res.render('register', {});
});

app.get("/auth", (req, res) => {
    res.render('login', {});
});

app.post("/auth", encodeUrl, async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    con.connect(function (err) {
        if (err) {
            console.log(err);
        }

        con.query(`SELECT * FROM users WHERE email = '${email}'`, async (err, result) => {
            if (err) {
                console.log(err);
            }

            if (Object.keys(result).length > 0) {
                const hashedPassword = result[0].password;
                const isPasswordValid = await bcrypt.compare(password, hashedPassword);

                if (isPasswordValid) {
                    req.session.user = {
                        username: result[0].username,
                        email: email,
                        password: hashedPassword
                    };
                    userPage(req, res);
                } else {
                    res.render('login', { error: 'Nieprawidłowe hasło. Spróbuj ponownie.' });
                }
            } else {
                res.render('login', { error: 'Nieprawidłowy adres e-mail. Spróbuj ponownie.' });
            }
        });
    });
});

function userPage(req, res) {

	res.redirect('/');
	

}

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/auth");
    });
});

app.get('/profile', requireAuth, (req, res) => {
    res.render('profile', {
        user: req.session.user,
        successMessage: null,
        errorMessage: null
    });
});

app.post('/updateProfile', encodeUrl, requireAuth, (req, res) => {
    var newUsername = req.body.newUsername;
    var newPassword = req.body.newPassword;

    // Update the user session
    req.session.user.username = newUsername;
    req.session.user.password = newPassword;

    // Update the database with the new information
    var updateSql = `UPDATE users SET username='${newUsername}', password='${newPassword}' WHERE email='${req.session.user.email}'`;

    con.query(updateSql, function (err, result) {
        if (err) {
            console.error(err);
            res.render('profile', {
                user: req.session.user,
                errorMessage: 'Update failed. Please try again.',
                successMessage: null  // Dodano, aby upewnić się, że successMessage jest zdefiniowane
            });
        } else {
            console.log('Profile updated successfully.');
            res.render('profile', {
                user: req.session.user,
                successMessage: 'Profile updated successfully.',
                errorMessage: null  // Dodano, aby upewnić się, że errorMessage jest zdefiniowane
            });
        }
    });
});



function toggleNavbar() {
	var navbar = document.querySelector('.navbar');
	navbar.classList.toggle('active');
}
app.listen(3000, () => {
	console.log("Server running on port 3000");
});

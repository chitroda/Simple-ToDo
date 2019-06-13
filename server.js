const crypto = require('crypto');

module.exports = {
    index: (req, res) => {
        if(req.session.user){
            res.render('index.ejs', {
                current_url: '/',
                name: req.session.user_name
            });
        }
        else{
            res.redirect('/login');
        }
    },
    addToDo: (req, res) =>  {
        let date = new Date().toJSON().split('T')[0];
        let todo_name = req.body.todo;
        if(todo_name !== ''){
            let sql = 'INSERT INTO todo_list SET todo_name="'+todo_name+'", creation_date="'+date+'", user_id="'+req.session.user+'"';
            db.query(sql, (err) => {
                if(err) throw err;
                let json =  {"success":"Inserted successfully"}; 
                return res.send(json);
            });
        }
        else{
            let json =  {"error":"Write some todo first!"};
            return res.send(json);
        }
    },
    showToDo: (req, res) => {
        let sql = 'SELECT * FROM todo_list WHERE user_id="'+req.session.user+'" ORDER BY id DESC';
        db.query(sql, (err, result) => {
            if(err) throw err;
            return res.send(result);
        });
    },
    todo_history: (req, res) => {
        var id = req.body.id;
        db.query('SELECT * FROM todo_list WHERE id="'+id+'" AND user_id="'+req.session.user+'"', (err, result, fields) => {
            if(result[0].old_todo){
                db.query('UPDATE todo_list SET old_todo=0 WHERE id="'+id+'" AND user_id="'+req.session.user+'"', (err) => {
                    if(err) throw err;
                    return res.send(false);
                });
            }
            else{
                db.query('UPDATE todo_list SET old_todo=1 WHERE id="'+id+'" AND user_id="'+req.session.user+'"', (err) => {
                    if(err) throw err;
                    return res.send(true);
                });
            }
        });
    },
    login_page: (req, res) => {
        if(req.session.user){
            req.session.user = false;
            req.session.user_name = false;
            res.redirect('/login');
        }
        res.render('login.ejs', {
            current_url: '/login',
            error: '',
            email: ''
        });
    },
    login_user_todo: (req, res) => {
        let email = req.body.email;
        let pwd = req.body.password;
        let inserted_pwd = crypto.createHash('md5').update(pwd).digest('base64');
        if(email === '' && pwd !== ''){
            res.render('login.ejs', {
                current_url: '/login',
                error: 'Email is mandatory to login!',
                email: ''
            });
        }
        else if(pwd === '' && email !== ''){
            res.render('login.ejs', {
                current_url: '/login',
                error: 'Password can not be empty!',
                email: email
            });
        }
        else if(pwd === '' && email === ''){
            res.render('login.ejs', {
                current_url: '/login',
                error: 'Email & Password are mandatory to login!',
                email: ''
            });
        }
        else{
            db.query('SELECT user_id,name,email FROM user WHERE email="'+email+'" AND pwd="'+inserted_pwd+'"', (err, result) => {
                if(err) return res.status(500).send(err);
                if(result.length > 0){
                    req.session.user = result[0]['user_id'];
                    req.session.user_name = result[0]['name'];
                    res.redirect('/');
                }
                else{
                    res.render('login.ejs', {
                        current_url: '/login',
                        error: 'Please enter valid email & password',
                        email: email
                    });
                }
            });
        }
    },
    logout: (req, res)  => {
        if(req.session.user){
            req.session.user = false;
            req.session.user_name = false;
            res.redirect('/login');
        }
        else{
            res.redirect('/login');
        }
    },
    signup: (req, res) => {
        if(req.session.user){
            req.session.user = false;
            req.session.user_name = false;
            res.redirect('/signup');
        }
        res.render('signup.ejs', {
            current_url: '/signup',
            error: ''
        });
    },
    signup_process: (req, res) => {
        let name = req.body.name;
        let email = req.body.email;
        let pwd = req.body.password;
        let new_pwd = crypto.createHash('md5').update(pwd).digest('base64');
        if(name === '' || email === '' || pwd === ''){
            res.render('signup.ejs', {
                current_url: '/signup',
                error: 'Please fill all necessary field'
            });
        }
        else{
            db.query('SELECT email from user WHERE email="'+email+'"', (err,result) => {
                if(result.length > 0){
                    res.render('signup.ejs', {
                        current_url: '/signup',
                        error: 'Email already exist!'
                    });
                }
                else{
                    db.query('INSERT INTO user SET name="'+name+'", email="'+email+'", pwd="'+new_pwd+'"', (err,result) => {
                        if(err) return res.status(500).send(err);
                        res.redirect('/login');
                    });
                }
            });
        }
    }
};
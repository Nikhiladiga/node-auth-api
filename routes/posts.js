const router = require('express').Router();
const verify = require('./verify');

router.get('/',verify,(req,res)=>{
    res.json({
        posts:
        {title:"My first post",
        description:'Info that should not be accessible without loggin in'
    }
    });
});



module.exports = router;
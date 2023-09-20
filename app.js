const express = require('express');
const app = express();
const port = 3000;
// require('./models/index');
const userRouter = require('./router/user.router');
const eventRouter = require('./router/event.router');

app.use((req, res, next) => {
    console.log(`Method: ${req.method}, ip: ${req.ip}, path: ${req.path}`);
    next();
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user",userRouter);
app.use("/event",eventRouter);


app.listen(port, ()=>{
    console.log(`server started at ${port}`);
})
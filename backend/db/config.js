const mongoose = require("mongoose")

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> {
    console.log("Database Connected Successfully");
}).catch((err)=> {
    console.log("Error" + err)
})
import connectToDatabase from "./db/db.connect";
import app from "../src/app"


const PORT = process.env.PORT 

connectToDatabase()
.then(()=>{

    app.listen(PORT,()=>{
        console.log(`Server is Up and running on port ${PORT}`);
    })

})
.catch((error)=>{
    console.error(`Error While Connecting to Database ${error}`);
    return 0;
})
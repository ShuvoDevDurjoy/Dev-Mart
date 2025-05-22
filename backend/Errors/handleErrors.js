async function handleErrors(func,message,res){
    try{
        return await func;
    }catch(e){
        if(res){
            return res.send({
                success : false,
                message : message
            })
        }
        else{
            console.log(message);
        }
    }
}

export {
    handleErrors
}
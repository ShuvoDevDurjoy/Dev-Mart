import bcrypt from 'bcrypt'


const checkPassword = async(checkPassword, comparePassword)=>{
    try{
        const matches = await bcrypt.compare(checkPassword, comparePassword);
        console.log(checkPassword, comparePassword)

        console.log(matches)

        if(!matches){
            return {
                success: false
            }
        }

        return {
            success: true
        }
    }catch(e){
        return {
            success: false
        }
    }
}


export {
    checkPassword
}
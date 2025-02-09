//logic to deal with servers cold start
const getStatusMsg="Render server is set to Boot"
export const emptyReq=(req,res)=>{
    try {
        return res.status(200).json({message:"Server is booted up",data:getStatusMsg});
    } catch (error) {
        return res.status(404).json({message:"Issue with request"});
    }
}
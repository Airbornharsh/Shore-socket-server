import { Socket } from "socket.io";
import Authenticate from "../../../middlewares/Authenticate";

const main =async (data:any,socket:Socket)=>{

    socket.emit('ok', 'for your eyes only');
    
    // Authenticate(data);
    
    try {
        
    } catch (e:any) {
        
    }
}

export default main;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFpcmJvcm5oYXJzaCIsImVtYWlsSWQiOiJoYXJzaGtlc2hyaTEyMzQ1NjdAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOjc5NzgzNTYzNDYsIl9pZCI6IjYzZDRmNWYzNTNkZmZhNGM4NjZjNTMwZiIsImlhdCI6MTY3OTg1MTMwOX0.6FHr9X3ua0ry9QThdY-FFK596dd9eUkjPnQc5svishA
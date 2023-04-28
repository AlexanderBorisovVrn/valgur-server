import { createUser, getAllUsers, getUserInfoById } from './mongodb/controllers/user.controller.js';
import { createProperty, deleteProperty, getAllProperies, getPropertyDetail, updateProperty } from './mongodb/controllers/property.controller.js';


const userRoutes = (server, opts, done)=>{
    server.get('/',getAllUsers);
    server.post('/',createUser);
    server.get('/:id',getUserInfoById)
    done()
}

const propertyRoutes = (server, opts, done)=>{
    server.get('/',getAllProperies)
    server.get('/:id',getPropertyDetail)
    server.post('/',createProperty)
    server.patch('/:id',updateProperty)
    server.delete('/:id',deleteProperty)
    done()
}


export  {userRoutes,propertyRoutes};



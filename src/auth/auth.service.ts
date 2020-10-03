import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthenticationService, FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { Request } from 'express';
import { UserDto } from './dto/User.dto';

@Injectable()
export class AuthService {

    constructor(
        private firebaseAuth: FirebaseAuthenticationService,
        private fireStore: FirebaseFirestoreService
    ){}
    async getAllUser(){
        return this.firebaseAuth.listUsers()
    }

    async getAllWebinar(){
        const snapshot = await this.fireStore.collection('Webinar').get()
        const data = snapshot.docs.map(doc => doc.data());
        console.log("webinar", data)
        return data
    }

    async login(req:Request){
        const { authorization } = req.headers

        if (!authorization)
            throw new UnauthorizedException()
     
        if (!authorization.startsWith('Bearer'))
            throw new UnauthorizedException()
     
        const split = authorization.split('Bearer ')
        if (split.length !== 2)
            throw new UnauthorizedException()
        
        try {
            const token = split[1]
            const firebaseUser = await this.firebaseAuth.auth.verifyIdToken(token)
            const users = await this.fireStore.collection('User').where('uid','==', firebaseUser.uid).get();
            const UserDatas = await users.docs.map(doc => doc.data());
            if(UserDatas && UserDatas.length >=1){
                let user = <UserDto>UserDatas[0]
                delete user.uid
                return user
            }else{
                throw new NotFoundException();
            }
        } catch (error) {
            throw new NotFoundException();
        }
    }

    async validateUser(token: string){
        try {
            const firebaseUser = await this.firebaseAuth.auth.verifyIdToken(token)
            console.log("firebaseUser.uid", firebaseUser.uid)
            const users = await this.fireStore.collection('User').where('uid','==', firebaseUser.uid).get();
            // const users = await this.fireStore.collection('User').get();
            const data = await users.docs.map(doc => doc.data());
            // console.log("user", data)
            if(data && data.length >=1){
                // console.log("Find user", data[0])
                return data[0]
            }
            // throw new UnauthorizedException()
            return false
        } catch (error) {
            throw new UnauthorizedException()
        }
    }
}

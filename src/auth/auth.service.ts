import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthenticationService, FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { Request } from 'express';
import { UserDto } from './dto/User.dto';
import { UserRole } from './user-role.enum';

@Injectable()
export class AuthService {

    constructor(
        private firebaseAuth: FirebaseAuthenticationService,
        private fireStore: FirebaseFirestoreService
    ){}

 
    // async getAllUser(){
    //     return this.firebaseAuth.listUsers()
    // }

    // async getAllWebinar(){
    //     const snapshot = await this.fireStore.collection('Webinar').get()
    //     const data = snapshot.docs.map(doc => doc.data());
    //     console.log("webinar", data)
    //     return data
    // }
    async fillUserInfo(formData:any, user: UserDto){
        console.log("formData", formData)
        const users = await this.fireStore.collection('User').where('uid','==', user.uid).get()
        const userDocID = await users.docs[0].id
        try {
            const res = await this.fireStore.collection('User').doc(userDocID).update({
                kycData:formData,
                finishInfo:true,
                name: formData.firstName + " " + formData.lastName
            })
            // console.log("Document successfully updated!", res);

        } catch (error) {
            console.error("Error updating document: ", error);
            throw new BadRequestException()
        }
        
    }
    async login(user: UserDto){
        delete user.uid
        return user;
    }

    // async loginByToken(token:string){
    //     // const firebaseUser = await this.firebaseAuth.auth.verifyIdToken(token)
    //     const result = await this.validateUser(token)
    //     if(result){
    //         let user = <UserDto>result;
    //         delete user.uid;
    //         return user;
    //     }else{
    //         throw new NotFoundException()
    //     }
    // }
    async register(req:Request){
        // console.log("Enter register")
        const { authorization } = req.headers

        if (!authorization)
            throw new UnauthorizedException()
        // console.log("Have authorization")

        if (!authorization.startsWith('Bearer'))
            throw new UnauthorizedException()
        // console.log("Have Bearer")

        const split = authorization.split('Bearer ')
        if (split.length !== 2)
            throw new UnauthorizedException()
        // console.log("Have Bearer 2")

        const token = split[1]
        // console.log("finding user, token: ", token)
        const found = await this.validateUser(token)
        
        if(found){
            throw new BadRequestException('already registered')
        }
        // console.log("user not found")
        try {
            // console.log("Verifying Firebase token")
            const firebaseUser = await this.firebaseAuth.auth.verifyIdToken(token)
            // console.log("Verifying Firebase token success ")
            // console.log("Getting User data")
            const userData = await this.firebaseAuth.auth.getUser(firebaseUser.uid)
            // console.log("Getting User data success")
            let newUser:UserDto = {
                name: userData.displayName ? userData.displayName : "",
                uid: userData.uid,
                photoURL: userData.photoURL ? userData.photoURL : "",
                role: UserRole.USER,
                finishInfo: false,
                email: userData.email
            }
            // console.log("new User", newUser)
            await this.fireStore.collection('User').add(newUser)
            return;
        } catch (error) {
            console.error("error",error)
            throw new NotFoundException();
        }
    }

    async validateUser(token: string){
        try {
            // console.log("validate User, token: ", token)
            const firebaseUser = await this.firebaseAuth.auth.verifyIdToken(token)
            // console.log("firebaseUser.uid", firebaseUser.uid)

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
            console.error(error)
            throw new UnauthorizedException()
        }
    }
}

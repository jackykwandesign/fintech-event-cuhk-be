import { FirebaseAuthenticationService, FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from 'src/auth/dto/User.dto';
import { UserRole } from 'src/auth/user-role.enum';
import { UserOptDto } from './dto/userOptDto.dto';

@Injectable()
export class UserService {

    constructor(
        private firebaseAuth: FirebaseAuthenticationService,
        private fireStore: FirebaseFirestoreService
    ){}

    async getAllParticipant(){
        const snapshot = await this.fireStore.collection('User').where('role','==', UserRole.USER).get()
        const data = snapshot.docs.map(doc => doc.data());
        return data
    }

    async getShareParticipant(){
        const snapshot = await this.fireStore.collection('User').where('role','==', UserRole.USER).where('kycData.agreementOfShow','==', true).get()
        const data = snapshot.docs.map(doc => doc.data());
        return data
    }

    // async getAllUser(){
    //     const snapshot = await this.fireStore.collection('User').where('role','==', UserRole.USER).get()
    //     const data = snapshot.docs.map(doc => doc.data());
    //     return data
    // }

    async getAllHelperOrAdmin(){
        const snapshot = await this.fireStore.collection('User').where('role','in', [UserRole.ADMIN,UserRole.HELPER]).get()
        const data = snapshot.docs.map(doc => doc.data());
        return data
    }

    async setHelper(userOptDto: UserOptDto){
        const users = await this.fireStore.collection('User').where('email','==', userOptDto.email).get()
        const userDocID = await users.docs[0].id
        try {
            const res = await this.fireStore.collection('User').doc(userDocID).update({
                role:UserRole.HELPER
            })
            console.log("Document successfully updated!", res);

        } catch (error) {
            console.error("Error updating document: ", error);
            throw new BadRequestException()
        }
    }

    async createHelper(userOptDto: UserOptDto){
        const users = await this.fireStore.collection('User').where('email','==', userOptDto.email).get()
        if(users.docs.length === 0){
            try {
                const userRecord = await this.firebaseAuth.createUser({
                    email:userOptDto.email,
                    emailVerified: false,
                    displayName: 'Helper',
                    // photoURL:"",
                    disabled: false
                }) 
                let newUser:UserDto = {
                    name: "Helper",
                    uid: userRecord.uid,
                    photoURL: "",
                    role: UserRole.HELPER,
                    finishInfo: false,
                    email: userRecord.email
                }
                await this.fireStore.collection('User').add(newUser)
            } catch (error) {
                console.log('Error creating new user:', error);
                throw new BadRequestException()
            }

            // .then(async function(userRecord) {
            //     // See the UserRecord reference doc for the contents of userRecord.
            //     console.log('Successfully created new user:', userRecord.uid);
            //     // let newUser:UserDto = {
            //     //     name: "Helper",
            //     //     uid: userRecord.uid,
            //     //     photoURL: "",
            //     //     role: UserRole.HELPER,
            //     //     finishInfo: false,
            //     //     email: userRecord.email
            //     // }
            //     await this.fireStore.collection('User').add({})
            // })
            // .catch(function(error) {
            //     console.log('Error creating new user:', error);
            //     throw new BadRequestException()
            // });
        }else{
            const userDocID = await users.docs[0].id
            try {
                const res = await this.fireStore.collection('User').doc(userDocID).update({
                    role:UserRole.HELPER
                })
                console.log("Document successfully updated!", res);
    
            } catch (error) {
                console.error("Error updating document: ", error);
                throw new BadRequestException()
            }
        }

    }
}

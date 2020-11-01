import { FirebaseAuthenticationService, FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { UserDto } from 'src/auth/dto/User.dto';
import { UserRole } from 'src/auth/user-role.enum';
import { UserOptDto } from './dto/userOptDto.dto';

interface KYCData{
    salutation: string;

    knowOfConference: string;
    supportOrganization?: string;
    advertisement?: string;
    otherKnowOfConference?: string;

    // interest: string;
    otherInterest?: string;
    interestCheckbox:string[]

    agreementOfCollection: boolean;
    agreementOfShow: boolean;
    agreementOfReceiveInformation: boolean;

    firstName: string;
    lastName: string;
    contactEmail: string
    jobTitle: string;
    organization: string;
    contactNumber: string
    areaCode: string;
}

interface UserDoc {
    name: string;
    uid: string;
    photoURL: string;
    role: UserRole.USER;
    finishInfo: boolean;
    email: string;
    kycData: KYCData;
    loginTime: number;
    lastLoginAt: Date;

}

require('dotenv').config();
import * as config from 'config'
const smtpConfig = config.get('smtp')

// let smtpAccount = {
//     host: process.env.NODE_ENV === "production" ? process.env.SMTP_HOST : smtpConfig.host,
//     port: process.env.NODE_ENV === "production" ? Number(process.env.SMTP_PORT) : smtpConfig.port,
//     email: process.env.NODE_ENV === "production" ? process.env.SMTP_EMAIL : smtpConfig.email,
//     password: process.env.NODE_ENV === "production" ? process.env.SMTP_PASSWORD : smtpConfig.password,
// }

let smtpAccount = {
    host: "smtp.cintec.cuhk.edu.hk",
    port: 25,
    email: "finteconf@cintec.cuhk.edu.hk",
    password: "cin@1358",
}

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

    async getUserByEmail(email:string){
        const snapshot = await this.fireStore.collection('User').where('email','==', email).get()
        // const data = snapshot.docs.map(doc => doc.data());
        if(snapshot.docs.length === 0){
            throw new NotFoundException()
        }else{
            return snapshot.docs[0].data()
        }
    }

    async getUserDocIDByEmail(email:string){
        const snapshot = await this.fireStore.collection('User').where('email','==', email).get()
        // const data = snapshot.docs.map(doc => doc.data());
        if(snapshot.docs.length === 0){
            throw new NotFoundException()
        }else{
            return snapshot.docs[0].id
        }
    }

    async getUserDocByEmail(email:string):Promise<UserDoc>{
        const snapshot = await this.fireStore.collection('User').where('email','==', email).get()
        // const data = snapshot.docs.map(doc => doc.data());
        if(snapshot.docs.length === 0){
            throw new NotFoundException()
        }else{
            return snapshot.docs[0].data() as unknown as UserDoc
        }
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

    async deleteFirebaseUserAndUserDataByEmail(email:string){
        try {
            const user = await this.firebaseAuth.getUserByEmail('tszkitkwan88884@gmail.com')
            await this.firebaseAuth.deleteUser(user.uid) 
            try {
                const userDocID = await this.getUserDocIDByEmail('tszkitkwan88884@gmail.com')
                await this.fireStore.collection('User').doc(userDocID).delete()
            } catch (error) {
                console.log("error", error)
            }
        } catch (error) {
            console.log("error", error)
            throw new BadRequestException()
        }

    }

    processUserDoc(data: any){
        let KYCDataDoc:KYCData={
            salutation: data.salutation ? data.salutation : "",
            firstName: data.firstName ? data.firstName : "",
            lastName: data.lastName ? data.lastName : "",
            organization: data.organization ? data.organization : "",
            jobTitle: data.jobTitle ? data.jobTitle : "",
            contactEmail: data.contactEmail ? data.contactEmail : "",
            contactNumber: data.contactNumber ?  data.contactNumber : "",
            areaCode: data.areaCode ? data.areaCode : "",

            knowOfConference: data.knowOfConference ? data.knowOfConference : "",
            supportOrganization: "unknown",
            advertisement: "unknown",
            otherKnowOfConference: "unknown",

            interestCheckbox:[],
            otherInterest: "",

            agreementOfCollection: true,
            agreementOfShow: false,
            agreementOfReceiveInformation: true,

            // supportOrganization?: string;
            // advertisement?: string;
            // otherKnowOfConference?: string;
        }
        if(KYCDataDoc.knowOfConference === ""){
            KYCDataDoc.knowOfConference = "Others"
            KYCDataDoc.otherKnowOfConference = "unknown"
        }
        data.interest1 && KYCDataDoc.interestCheckbox.push("AI & Machine Learning")
        data.interest2 && KYCDataDoc.interestCheckbox.push("Big Data Analytics")
        data.interest3 && KYCDataDoc.interestCheckbox.push("Cybersecurity")
        data.interest4 && KYCDataDoc.interestCheckbox.push("STO/Tokenization/Virtual Assets")
        data.interest5 && KYCDataDoc.interestCheckbox.push("FinTech in the Banking/Virtual Banking")

        if(KYCDataDoc.interestCheckbox.length === 0){
            KYCDataDoc.interestCheckbox = ["AI & Machine Learning", "Big Data Analytics", "Cybersecurity", "STO/Tokenization/Virtual Assets", "FinTech in the Banking/Virtual Banking"] 
        }
        let newUserDoc ={
            name: data.name,
            uid: "test 1234", // change fake
            photoURL: "",
            role: UserRole.USER,
            finishInfo:true,
            email: data.email,
            kycData: KYCDataDoc
        } 
        return newUserDoc
    }

    async sendInternalMessage(sender:UserDto, receiverEmail:string, message:string){

          // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: smtpAccount.host,
            port: smtpAccount.port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtpAccount.email, // generated ethereal user
                pass: smtpAccount.password, // generated ethereal password
            },
        });

        // console.log("build test transporter",transporter)
        let senderDoc = await this.getUserDocByEmail(sender.email)
        console.log("senderDoc", senderDoc.kycData as KYCData)

        let newMessage = `You have got an message from conference participant ${sender.name} (${sender.email}), ${senderDoc.kycData.jobTitle}@${senderDoc.kycData.organization}. Message: ${message}` 
        let newMessageHTML = "" + 
        `<p>Hello ${sender.name}, </p>` + 

        '<br/>'+

        `<p>You have got an message from conference participant ${sender.name} ( ${sender.email} )</p>` + 
        // '<br/>' + 
        `<p>Message: ${message} </p>` + 
        // '<br/>' + 
        '<br/>'+

        '<p>If you are not in this conference, you can ignore this email.</p>'+

        '<br/>'+

        '<p>Thanks, </p>'+
        '<p>Your 2020 CUHK FinTech Conference team</p>'

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `noreply@cintec.cuhk.edu.hk`, // sender address
            to: receiverEmail, // list of receivers
            subject: `Message from 2020 Fintech Conference participant ${sender.name}`, // Subject line
            text: newMessage, // plain text body
            html: newMessageHTML, // html body
        });

        // console.log("send mail",info)

        await this.fireStore.collection('Message').add({
            senderEmail:sender.email,
            senderName:sender.name,
            receiverEmail:sender.email,
            message:message,
            timestamp:new Date()
        })

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    async updateLoginTime(userOptDto:UserDto){
        console.log("userOptDto", userOptDto)
        const users = await this.fireStore.collection('User').where('email','==', userOptDto.email).get()
        const userDocID = await users.docs[0].id
        const lastLoginTime =  await users.docs[0].data().loginTime
        try {
            const res = await this.fireStore.collection('User').doc(userDocID).update({
                loginTime: lastLoginTime ? lastLoginTime + 10 : 10,
                lastLoginAt: new Date().toISOString()
            })
            console.log("Document successfully updated!", res);

        } catch (error) {
            console.error("Error updating document: ", error);
            throw new BadRequestException()
        }
    }
    async createFirebaseUser(){

        // UserDataList.map(async (data, index)=>{

        //     // await this.fireStore.collection('User').add(newUserDoc)
    
        //     let newUserDoc = this.processUserDoc(data)
        //     // console.log(newUserDoc)

        //     try {
        //         //try to find ac
        //         await this.getUserByEmail(newUserDoc.email)
        //         console.log("exist, skip: ",newUserDoc.email)
        //     } catch (error) {
        //         // if ac not exist 

        //         //try to remove old doc
        //         try {
        //             await this.deleteFirebaseUserAndUserDataByEmail(newUserDoc.email)
        //         } catch (error) {
                    
        //         }

        //         const newUser = await this.firebaseAuth.createUser({
        //             email: newUserDoc.email,
        //         })
        //         newUserDoc.uid = newUser.uid

        //         await this.fireStore.collection('User').add(newUserDoc)
        //         console.log("newUser", newUser)

        //     }

            
        // })
    }
}

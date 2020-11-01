import { FirebaseAuthenticationService, FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWebinarDto } from './dto/update-webinar.dto';

@Injectable()
export class WebinarService {
    constructor(
        // private firebaseAuth: FirebaseAuthenticationService,
        private fireStore: FirebaseFirestoreService
    ){}

    async getAllWebinar(){
        const snapshot = await this.fireStore.collection('Webinar').get()
        let resData = []
       snapshot.docs.map(doc => {
        resData.push({
            id:doc.id,
            ...doc.data(),
        })
        
       });
        return resData
    }

    // updateWebinarDto:UpdateWebinarDto
    async findWebinar(id:string){
        const snapshot = await this.fireStore.collection('Webinar').where('id','==', id).get()
        if(snapshot.docs.length === 0){
            throw new NotFoundException()
        }else{
            return snapshot.docs[0].data()
        }
    }

    async updateWebinarByID( updateWebinarDto:UpdateWebinarDto){
        try {
            // const webinar = await this.findWebinar(updateWebinarDto.id)
            let data = {}
            // updateWebinarDto.zoomURL && ( data['zoomURL'] = updateWebinarDto.zoomURL)
            // updateWebinarDto.replayURL && ( data['replayURL'] = updateWebinarDto.replayURL)
            const res = await this.fireStore.collection('Webinar').doc(updateWebinarDto.id).update({
                zoomURL:updateWebinarDto.zoomURL ? updateWebinarDto.zoomURL : "",
                replayURL: updateWebinarDto.replayURL ? updateWebinarDto.replayURL : ""
            })
            console.log("Document successfully updated!", res);
        } catch (error) {
            console.error(error)
            throw new BadRequestException()
        }
        
    }
}

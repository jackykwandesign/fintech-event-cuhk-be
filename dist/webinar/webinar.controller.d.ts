import { WebinarService } from './webinar.service';
export declare class WebinarController {
    private webinarService;
    constructor(webinarService: WebinarService);
    getAllWebinar(): Promise<FirebaseFirestore.DocumentData[]>;
}

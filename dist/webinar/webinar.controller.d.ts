import { UpdateWebinarDto } from './dto/update-webinar.dto';
import { WebinarService } from './webinar.service';
export declare class WebinarController {
    private webinarService;
    constructor(webinarService: WebinarService);
    getAllWebinar(): Promise<any[]>;
    updateWebinar(updateWebinarDto: UpdateWebinarDto): Promise<void>;
}

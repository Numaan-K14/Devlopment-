import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { NbolLeadLevels } from "../model/leadLevel.model";
import { NbolController } from "./nbolLeadLevel.controller";
import { Competencies } from "../../competencies/model/competency.model";
import { NbolService } from "./nbolLeadLevel.service";
import { RequestParamsService } from "src/Modules/requestParams";
import { ClientRoles } from "src/Modules/client-roles-levels/model/role.model";

@Module({
    imports: [
        SequelizeModule.forFeature([NbolLeadLevels,Competencies, ClientRoles])
    ],
    controllers:[NbolController],
    providers:[NbolService, RequestParamsService],
    exports:[NbolService]

})
export class NbolModule{}
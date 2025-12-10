import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ClientRoles } from "../model/role.model";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { RequestParamsService } from "src/Modules/requestParams";
import { Participants } from "src/Modules/participants/model/participants.model";

@Module({
    imports: [
        SequelizeModule.forFeature([ClientRoles, Participants])
    ],
    controllers:[RoleController],
    providers: [RoleService, RequestParamsService],
    exports:[RoleService]
})
export class RoleModule{}
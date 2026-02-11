import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRole, Users } from '../model/user.model';
import { createUser } from '../dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import { IsNull, Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { EmailService } from 'src/Modules/mail/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users)
    private userModel: typeof Users,

    @InjectModel(Participants)
    private participantsModel: typeof Participants,

    @InjectModel(Assessros)
    private assessorsModel: typeof Assessros,

    private readonly jwtService: JwtService,
    private readonly requestParams: RequestParamsService,
    private emailService: EmailService,

    private sequelize: Sequelize,
  ) {}

  async createUser(createUser: createUser): Promise<any> {
    try {
      const { name, email, phone_number, role, client_id } = createUser;
      const salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash('1234', salt);
      const existinguser = await this.userModel.findOne({
        where: {
          email,
          role: {
            [Op.ne]: 'assessor',
          },
        },
      });

      if (existinguser) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'User already exists. Please use a unique email.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      let assessor;
      if (createUser.is_assessor == true) {
        assessor = await this.assessorsModel.create(
          {
            assessor_name: createUser.name,
            email: createUser.email,
            status: true,
          } as Assessros,
          { returning: true },
        );
      }
      const user = await this.userModel.create({
        name: name,
        email: email,
        phone_number: phone_number,
        password: hashPassword,
        role: role,
        client_id: client_id,
        assessor_id: assessor?.id,
      } as Users);

      // const createdUser = await this.userModel.findByPk(user.id, {
      //   attributes: { exclude: ['password', 'accessToken'] },
      // });

      const { password, ...createdUser } = user.toJSON();
      return createdUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(
    userId: string,
    updateUser: Partial<createUser>,
  ): Promise<any> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      return {
        message: 'user not found',
      };
    }
    await user?.update(updateUser);
  }

  async allUsers(page: number = 0, limit: number = 10): Promise<any> {
    const offset = page * limit;

    const users = await this.userModel.findAll({
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email', 'role'],
      where: {
        ...getSearchObject(this.requestParams.query, [
          'name',
          // 'email',
          'phone_number',
          // 'participant_name',
          // 'assessor_name',
        ]),
      },
      include: [
        {
          model: this.participantsModel,
          as: 'participants',
          attributes: ['id', 'participant_name'],
        },
        {
          model: this.assessorsModel,
          as: 'assessor',
          attributes: ['id', 'assessor_name'],
        },
      ],
    });
    const count = await this.userModel.count();
    return {
      rows: users,
      count: count,
    };
  }

  async deleteUser(userId: string): Promise<any> {
    const user = await this.userModel.findByPk(userId);
    if (user) {
      await user.destroy();
      return {
        message: 'User Deleted Successfully',
      };
    }
  }

  async generateAccessAndRefreshTokens(
    userId: string,
    role: UserRole,
  ): Promise<{ accessToken: string }> {
    try {
      const user = await this.userModel.findByPk(userId, {
        attributes: ['id', 'email', 'role'],
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET || 'default_secret',
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY, //updatetd from ,{}
      });

      return { accessToken };
    } catch (error) {
      console.error('Error generating tokens:', error);
      throw new HttpException(
        'Error generating tokens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const inactiveAssessor = await this.assessorsModel.findOne({
        where: {
          email: loginDto.email,
        },
      });
      if (inactiveAssessor) {
        if (inactiveAssessor.status === false) {
          throw new HttpException(
            {
              status: 400,
              success: false,
              message: 'Access Denied: Your Account Is Currently Inactive',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      const user = await this.userModel.findOne({
        where: { email: loginDto.email },
        raw: true,
        include:[
          {
            model: this.participantsModel,
            as: 'participants',
            attributes: ['cohort_id'],
            required: false,
          }
        ]
      });
      
      if (!user) {
        throw new HttpException(
          {
            status: 404,
            success: false,
            message: 'User Does Not Exist',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const isMatched = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatched) throw new UnauthorizedException('Invalid Credentials!');

      const { accessToken } = await this.generateAccessAndRefreshTokens(
        user.id,
        user.role,
      );
      const { password, otp, ...loggedInUser  } = user;
      return {
        user: loggedInUser,
        accessToken,
      };
    } catch (error) {
      console.error('Error during login:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error during login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateOtp(email: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await Users.findOne({
        where: {
          email,
        },
        transaction,
      });
      if (!user) {
        throw new HttpException(
          {
            message: 'No user found with this email',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      await user.update(
        {
          otp: otp,
        },
        { transaction },
      );
      await transaction.commit();

      try {
        this.emailService.sendOtpToUser(email, 'Your OTP for Password Reset', {
          name: user.name,
          email: user.email,
          otp,
        });
      } catch (error) {
        throw new HttpException(
          {
            message: 'OTP generated but error while sending email',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return 'The OTP has been sent to your email successfully';
    } catch (error) {
      if ((transaction as any).finished) {
        await transaction?.rollback();
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Error while sending OTP',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyOtp(email: string, otp: number) {
    const user = await Users.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException(
        {
          message: 'User with this email not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.otp != otp || !otp) {
      throw new HttpException(
        {
          message: 'The OTP you entered is incorrect',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return 'OTP verified successfully';
  }

  async updatePassword(email: string, password: string, otp: number) {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await Users.findOne({
        where: {
          email,
        },
        transaction,
      });
      if (!user) {
        throw new HttpException(
          {
            message: 'User with this email not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (user.otp != otp || !otp) {
        throw new HttpException(
          {
            message: 'The OTP you entered is incorrect',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(password, salt);
      await user.update(
        {
          password: hashPassword,
          otp: null as any,
        },
        {
          transaction,
        },
      );
      await transaction.commit();
      return 'Password updated successfully';
    } catch (error) {
      if ((transaction as any).finished) {
        await transaction?.rollback();
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Error while updating your password',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

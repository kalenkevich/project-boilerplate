import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from 'type-graphql';
import {
  Column, CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  user = 'user',
  manager = 'manager',
  admin = 'admin',
}

export enum UserContactType {
  ok ='ok',
  vk ='vk',
  facebook = 'facebook',
  instagram = 'instagram',
  youtube = 'youtube',
  skype = 'skype',
  email = 'email',
}

export enum UserStatus {
  invited = 'invited',
  phoneConfirmed = 'phoneConfirmed',
  active = 'active',
  inactive = 'inactive',
}

registerEnumType(UserRole, {name: 'UserRole'});
registerEnumType(UserStatus, {name: 'UserStatus'});
registerEnumType(UserContactType, {name: 'UserContactType'});

@InputType("UserContactInput")
@ObjectType("UserContact")
export class UserContact {
  @Field((type) => UserContactType)
  type: UserContactType;

  @Field({ defaultValue: '' })
  value: string;
}

@InputType("UserSettingsInput")
@ObjectType("UserSettings")
export class UserSettings {
  @Field({ defaultValue: false })
  socialNetworksVisible: boolean;

  @Field({ defaultValue: false })
  structureVisible: boolean;

  @Field({ defaultValue: false })
  phoneVisible: boolean;
}

@InputType()
export class UserDataInput {
  @Field({ nullable: true })
  public firstName: string;

  @Field({ nullable: true })
  public lastName: string;

  @Field({nullable: true})
  public phone: string;

  @Field({nullable: true})
  public avatarUrl: string;

  @Field(type => [UserContact], { nullable: true })
  public contacts: UserContact[];

  @Field(type => UserSettings, { nullable: true })
  public settings: UserSettings;
}

export const DefaultUserContacts = [{
  type: UserContactType.ok,
  value: '',
}, {
  type: UserContactType.vk,
  value: '',
}, {
  type: UserContactType.facebook,
  value: '',
}, {
  type: UserContactType.instagram,
  value: '',
}, {
  type: UserContactType.youtube,
  value: '',
}, {
  type: UserContactType.skype,
  value: '',
}, {
  type: UserContactType.email,
  value: '',
}];

export const DefaultUserSettings = {
  socialNetworksVisible: false,
  structureVisible: false,
  phoneVisible: false,
};

@Entity('users')
@ObjectType()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  anonymous: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email: string;

  @Field({ nullable: true })
  @Column()
  phone: string;

  @Field(type => [UserContact])
  @Column({ type: 'jsonb', default: DefaultUserContacts })
  contacts: UserContact[];

  @Field(type => UserSettings, { nullable: true })
  @Column({ type: 'jsonb', default: DefaultUserSettings })
  settings: UserSettings;

  @Field()
  @Column({ default: '' })
  avatarUrl: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.user })
  @Field((type) => UserRole)
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.invited })
  @Field((type) => UserStatus)
  status: UserStatus;

  //authorization purpose only
  // TODO move all tokens to redis
  @Column({nullable: true})
  authorizationToken: string;

  @Column({nullable: true})
  refreshToken: string;

  @Column({nullable: true})
  verificationToken: string;

  @Column({nullable: true})
  signUpToken: string;

  @Column({nullable: true})
  resetPasswordToken: string;

  @Column({nullable: true})
  verificationCode: string;

  @Column({nullable: true})
  password: string;

  @Field(type => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @Field(type => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @Field(type => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  public activatedAt: Date;
}

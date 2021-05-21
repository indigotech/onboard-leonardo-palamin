import { Dog } from "@data/db/entity/dog";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  birthDate!: string;

  @OneToOne(() => User, (user) => user.dog)
  dog!: Dog;
  user!: User;
}

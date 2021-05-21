import { Dog } from "@data/db/entity/dog";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

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

  @OneToMany(() => Dog, (dog: Dog) => dog.user, { cascade: true })
  dog!: Dog[];
}

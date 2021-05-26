import { Address } from "@data/db/entity/address";
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

  @OneToMany(() => Address, (address) => address.userId)
  address!: Address[];
}

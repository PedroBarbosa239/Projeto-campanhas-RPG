import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import Candidatura from "./candidatura";
import Organizador from "./organizador";

export enum Sistema {
  DED = "ded",
  ORDEM = "ordem",
}

export enum Status {
  ABERTO = "aberto",
  FECHADO = "fechado",
}

@Entity()
export default class Campanha extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

 @Column()
  nome: string;

    @Column({ type: "enum", enum: Sistema })
  sistema: Sistema;

  @Column()
  descrição: string;


  @Column({ type: "enum", enum: Status })
  status: Status;


   @Column()
  limite_jogadores : number;

  @Column({ type: 'boolean', default: false })
  urgente: boolean;


  @ManyToOne(() => Organizador, (organizador) => organizador.campanhas, {
    onDelete: "CASCADE",
  })
  organizador: Organizador;

  @OneToMany(() => Candidatura, (candidatura) => candidatura.campanha)
  candidaturas: Candidatura[];
}

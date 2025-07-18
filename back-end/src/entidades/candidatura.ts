import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Campanha from "./campanha";
import Jogador from "./jogador";


@Entity()
export default class Candidatura extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descrição: String;
  
  @Column()
  carta: String;

  @CreateDateColumn()
  data_submissão: Date;  

  
  @Column({ type: 'boolean', default: false })
  personagem_pronto: boolean;


  @ManyToOne(() => Campanha, (campanha) => campanha.candidaturas, {
    onDelete: "CASCADE",
  })
  campanha: Campanha;

  @ManyToOne(() => Jogador, (jogador) => jogador.candidaturas, {
    onDelete: "CASCADE",
  })
  jogador: Jogador;
}

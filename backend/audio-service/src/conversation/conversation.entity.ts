import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        nullable: true
    })
    train: string;

    @OneToMany(m => Message, m => m.conversation)
    messages: Message[];
}

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn()
    time: Date
    @Column()
    source: string;
    @Column()
    content: string;
    @Column({
        nullable: true
    })
    audio: string;
    @ManyToOne(c => Conversation, c => c.messages)
    conversation: Conversation;
}
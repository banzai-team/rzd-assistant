import { Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(m => Message, m => m.conversation)
    messages: Message[];
}

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    time: Date

    content: string;

    @ManyToOne(c => Conversation, c => c.messages)
    conversation: Conversation;
}
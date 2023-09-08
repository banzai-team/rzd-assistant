import { Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Conversation {
    @PrimaryColumn()
    id: number;

    @OneToMany(m => Message, m => m.conversation)
    messages: Message[];

}

@Entity()
export class Message {
    @PrimaryColumn()
    id: number;

    time: Date

    content: string;

    @ManyToOne(c => Conversation, c => c.messages)
    conversation: Conversation;
}
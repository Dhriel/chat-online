
export interface ThreadsProps {
    idRoom: string;
    roomName: string;
    roomImage: string;
    owner: string;
}

export interface MessagesProps {
    createdAt: string;
    name: string;
    text: string;
    image?: string;
    dateHour?: string;
}

export interface UserProps {
    uid: string;
    name: string;
    image: string;
}
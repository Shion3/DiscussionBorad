import DiscussionService from "./DiscussionService";

export interface ILikeProps {
    service: DiscussionService;
    likeString: string[];
    messageId: number;
    userId: number;
}
export interface ILikeState {
    isCurrentLike: boolean;
    userId: number;
    likeString: string[];
    reload: boolean;
}
import DiscussionService from "./DiscussionService";

export interface ILikeProps {
    service: DiscussionService;
    likeString: string[];
}
export interface ILikeState {
    isCurrentLike: boolean;
}
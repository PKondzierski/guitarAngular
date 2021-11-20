export interface Comment {
    id?: number,
    lessonId?: number,
    username?: string,
    created?: string,
    comment?: string,
    mainCommentId?: number,
    subComments?: Comment[]    
}

// private long id;
// private long lessonId;
// private String username;
// private Timestamp created;
// private String comment;
// private Long mainCommentId;
// private List<CommentDto> subComments;
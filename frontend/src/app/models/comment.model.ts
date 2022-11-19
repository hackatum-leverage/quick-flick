export interface CommentsResult {
  comments: ReviewComment[]
}

export interface ReviewComment {
  name: string,
  review: string,
}

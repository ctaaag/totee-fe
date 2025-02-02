import React, { useState } from 'react';
import classes from './comment.module.scss';
import { handleTime } from '@utils/handleTime';
import { useRecoilState } from 'recoil';
import { UserState } from '@store/index';
import { Input, Button } from '@components/atoms';
import { useUpdateComment, useDeleteComment } from '@hooks/useMutateQuery';
import { CommentInput } from '../CommentInput/CommentInput';
import { ICommentPropsType } from 'types/comment.types';
import { ReplyComment } from './ReplyComment';

export function Comment({ postId, comment }: ICommentPropsType) {
  const [user, setUser] = useRecoilState(UserState);
  const [isEdit, setIsEdit] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [inputValue, setInputValue] = useState(comment.content);
  const [replyInputValue, setReplyInputValue] = useState('');

  const UpdateCommentMutate = useUpdateComment(postId, comment.commentId);
  const DeleteCommentMutate = useDeleteComment(postId, comment.commentId);

  const onClickUpdateBtn = () => [
    UpdateCommentMutate.mutateAsync({
      postId: postId,
      content: inputValue,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log('넨');
          setIsEdit(false);
        }
      })
      .catch((err) => console.log(err)),
  ];

  const onClickDeleteBtn = () => {
    DeleteCommentMutate.mutateAsync()
      .then((res) => {
        if (res.status === 200) {
          setIsEdit(false);
        }
      })
      .catch((err) => console.log(err));
  };
  console.log(comment);

  return (
    <div className={classes.comment_container}>
      <div className={classes.profile_wrapper}>
        <div className={classes.profile_img} style={{
          backgroundRepeat:"no-repeat",
          backgroundSize: "cover",
          backgroundImage : `url(${comment.profileImageUrl})`
        }}></div>
        <div className={classes.vertical_line}></div>
      </div>
      <div className={classes.content_wrapper}>
        <div className={classes.title}>
          <div className={classes.flex}>
            <div className={classes.nickname}>{comment?.nickname}</div>
            <div className={classes.time}>
              {handleTime(comment?.created_at)}
            </div>
          </div>
         
          {isEdit ? (
            <div className={classes.text_button}>
              <span
                onClick={() => {
                  setIsEdit(false);
                  setInputValue(comment.content);
                }}
              >
                취소
              </span>
              <hr className={classes.vertical_line2}></hr>
              <span onClick={onClickUpdateBtn}>수정</span>
            </div>
          ) : (

            <div className={classes.text_button}>
               {user.nickname === comment.nickname &&
               <>
                <span onClick={() => setIsEdit(true)}>수정</span>
                <hr className={classes.vertical_line2}></hr>
                <span onClick={onClickDeleteBtn}>삭제</span>
                <hr className={classes.vertical_line2}></hr>
              </>
              }
              <div
                className={classes.reply_button}
                onClick={() => setIsReply(!isReply)}
              >
                답글달기
              </div>
            </div>
          )}
        </div>
        <hr className={classes.line2}></hr>
        <div className={classes.content}>
          {isEdit ? (
            <Input
              value={inputValue}
              type="text"
              name="comment"
              id="comment"
              placeholder="댓글을 입력해주세요"
              onChange={(e) => setInputValue(e.target.value)}
            ></Input>
          ) : (
            <>{comment?.content}</>
          )}
        </div>
        {/*<div*/}
        {/*  className={classes.reply_button}*/}
        {/*  onClick={() => setIsReply(!isReply)}*/}
        {/*>*/}
        {/*  답글달기*/}
        {/*</div>*/}

        <div className={classes.reply_comment_wrapper}>
          {comment.replyList &&
            comment.replyList.map((reply) => (
              <ReplyComment
                postId={postId}
                comment={reply}
                commentId={comment.commentId}
              ></ReplyComment>
            ))}
        </div>
        {isReply && (
          <CommentInput
            postId={postId}
            commentId={comment.commentId}
            type={'reply'}
            onClickCancle={() => setIsReply(false)}
          ></CommentInput>
        )}
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import axios from '../axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/postsSlice';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

export const Home = () => {
  const { posts, tags } = useSelector((state) => state.postsSlice);
  const userData = useSelector((state) => state.authSlice.data);
  const dispatch = useDispatch();
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);
  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label='basic tabs example'>
        <Tab label='Новые' />
        <Tab label='Популярные' />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((item, index) =>
            isPostsLoading ? (
              <Post isLoading={true} />
            ) : (
              <Post
                key={index}
                _id={item._id}
                title={item.title}
                // imageUrl={item.imageUrl ? item.imageUrl : ''}
                imageUrl={item.imageUrl ? `http://localhost:4445${item.imageUrl}` : ''}
                user={{ fullName: item.user.fullname, imageUrl: item.user.pictureUrl }}
                createdAt={item.createdAt}
                viewsCount={item.viewsCount}
                commentsCount={3}
                tags={item.tags.map((item) => {
                  return item;
                })}
                isEditable={userData?._id === item.user._id}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

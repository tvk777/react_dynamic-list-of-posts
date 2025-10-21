/* eslint no-console: ["error", { allow: ["warn", "log", "error"] }] */

import { useState, useEffect } from 'react';
import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { User } from './types/User';
import { getUsers } from './api/users';
import { Post } from './types/Post';
import { getPostsByUserid } from './api/posts';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openedPost, setOpenedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();

        setUsers(usersData);
      } catch (error) {
      } finally {
      }
    };

    fetchUsers();
  }, []);

  const onSelectUser = async (user: User) => {
    setSelectedUser(user);
    setisLoading(true);
    setErrorMessage('');
    try {
      const postsData = await getPostsByUserid(user.id);

      setPosts(postsData);
    } catch (error) {
      setErrorMessage('Something went wrong!');
    } finally {
      setisLoading(false);
    }
  };

  const onOpenPost = (post: Post) => {
    setOpenedPost(prev => {
      if (prev?.id === post.id) {
        return null;
      }

      return post;
    });
  };

  const noPosts =
    !errorMessage && !isLoading && selectedUser && posts.length === 0;

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  onSelectUser={onSelectUser}
                  selectedUser={selectedUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {isLoading && <Loader />}

                {errorMessage && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    {errorMessage}
                  </div>
                )}

                {noPosts && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {posts.length > 0 && (
                  <PostsList
                    posts={posts}
                    openedPost={openedPost}
                    onOpenPost={onOpenPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              { 'Sidebar--open': openedPost },
            )}
          >
            {openedPost && (
              <div className="tile is-child box is-success ">
                <PostDetails post={openedPost} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

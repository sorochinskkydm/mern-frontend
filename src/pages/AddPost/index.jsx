import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [imageUrl, setImageUrl] = useState('');
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const inputFileRef = useRef(null);
  const navigate = useNavigate();

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (error) {
      alert('Ошибка при загрузке файла');
      console.log(error);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        text: value,
        imageUrl,
        tags: tags,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);
      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.log(error);
      alert('Ошибка при публикации');
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then((response) => response.data)
        .then((data) => {
          setTitle(data.title);
          setImageUrl(data.imageUrl);
          setTags(data.tags);
          setValue(data.text);
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant='outlined' size='large'>
        Загрузить превью
      </Button>
      <input type='file' ref={inputFileRef} onChange={handleChangeFile} hidden />
      {imageUrl && (
        <Button variant='contained' color='error' onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )}
      {imageUrl && (
        <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt='Uploaded' />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant='standard'
        placeholder='Заголовок статьи...'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant='standard'
        placeholder='Тэги'
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={value} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size='large' variant='contained'>
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <Link to='/'>
          <Button size='large'>Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};

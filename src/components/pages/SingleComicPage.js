import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './singleComicPage.scss';
import xMen from '../../resources/img/x-men.png';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const SingleComicPage = () => {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    updateComic();
  }, [comicId]);

  const updateComic = () => {
    if (!comicId) {
      return;
    }
    onComicLoading();
    marvelService.getComic(comicId).then(onComicLoaded).catch(onError);
  };

  const onComicLoaded = (comic) => {
    setLoading(false);
    setComic(comic);
  };

  const onComicLoading = () => {
    setLoading(true);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const View = ({ comic }) => {
    const { title, description, pageCount, thumbnail, language, price } = comic;

    return (
      <div className="single-comic">
        <img src={thumbnail} alt={title} className="single-comic__img" />
        <div className="single-comic__info">
          <h2 className="single-comic__name">{title}</h2>
          <p className="single-comic__descr">{description}</p>
          <p className="single-comic__descr">{pageCount} pages</p>
          <p className="single-comic__descr">Language: {language}</p>
          <div className="single-comic__price">{price}$</div>
        </div>
        <Link to={'/comics/'}>
          <div className="single-comic__back">Back to all</div>
        </Link>
      </div>
    );
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

export default SingleComicPage;

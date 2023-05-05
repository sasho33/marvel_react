import './charList.scss';

import { Component } from 'react';
import MarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/spinner';

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
    // console.log(this.itemRefs);
    document.addEventListener('scroll', this.trackScrolling);
    console.log('scroll added');
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
    console.log('scroll removed');
  }

  //   trackScrolling = () => {
  //     const wrappedElement = document.querySelector('.char__list');
  //     if (this.isBottom(wrappedElement)) {
  //       console.log('char__list bottom reached');
  //       this.onRequest();
  //       document.removeEventListener('scroll', this.trackScrolling);
  //     }
  //   };

  trackScrolling = () => {
    const wrappedElement = document.querySelector('.char__list');
    const bottomDistance = wrappedElement.getBoundingClientRect().bottom - window.innerHeight;
    if (bottomDistance < 1 && !this.state.newItemLoading && !this.state.charEnded) {
      console.log('char__list bottom reached');
      this.onRequest(this.state.offset);
    }
  };

  onRequest = (offset) => {
    this.onCharlistLoading();
    this.marvelService.getAllCharachters(offset).then(this.onCharlistLoaded).catch(this.onError);
  };

  onCharlistLoading = () => {
    this.setState({ newItemLoading: true });
  };

  onCharlistLoaded = (newCharList) => {
    let ended = false;
    if (newCharList < 9) {
      ended = true;
    }

    this.setState(({ charList, offset }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onError = (error) => {
    this.setState({ loading: false, error: true });
  };

  itemRefs = [];

  setRef = (elem) => {
    this.itemRefs.push(elem);
  };

  setFocus = (id) => {
    this.itemRefs.forEach((item) => {
      item.classList.remove('char__item_selected');
    });
    this.itemRefs[id].classList.add('char__item_selected');
    this.itemRefs[id].focus();
  };

  renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: 'cover' };
      if (
        item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
      ) {
        imgStyle = { objectFit: 'unset' };
      }

      return (
        <li
          className="char__item"
          key={item.id}
          ref={this.setRef}
          onClick={() => {
            this.props.onCharSelected(item.id);
            this.setFocus(i);
          }}
          onKeyPress={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              this.props.onCharSelected(item.id);
              this.focusOnItem(i);
            }
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    // А эта конструкция вынесена для центровки спиннера/ошибки

    return <ul className="char__grid">{items}</ul>;
  }

  render() {
    const { charList, loading, error, newItemLoading, offset, charEnded } = this.state;
    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          onClick={() => this.onRequest(offset)}
          disabled={newItemLoading}
          style={{ display: charEnded ? 'none' : 'block' }}
          className="button button__main button__long"
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;

class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=87f4035a294fa61eec6f27cff745d93b';
  _baseOffset = '210';

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error('Could not fetch ' + url + ', status:' + res.status);
    }

    return await res.json();
  };

  getAllCharachters = async (offset = this._baseOffset) => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`,
    );
    return res.data.results.map(this._transformCharachter);
  };

  getCharachter = async (id) => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    return this._transformCharachter(res.data.results[0]);
  };

  getAllComics = async (offset = 0) => {
    const res = await this.getResource(
      `${this._apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${this._apiKey}`,
    );
    return res.data.results.map(this._transformComics);
  };

  getComics = async (id) => {
    const res = await this.getResource(`${this._apiBase}comics/${id}?${this._apiKey}`);
    return this._transformComics(res.data.results[0]);
  };

  _transformCharachter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : 'There is no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || 'There is no description',
      pageCount: comics.pageCount
        ? `${comics.pageCount} p.`
        : 'No information about the number of pages',
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      language: comics.textObjects[0]?.language || 'en-us',
      // optional chaining operator
      price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available',
    };
  };
}

export default MarvelService;

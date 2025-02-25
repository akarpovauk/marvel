class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apikey = 'apikey=10877f709e567804be49abd6a4c6cbcd';
	_baseOffset = 210;

	getResource = async (url) => {
		let res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}
		return await res.json();
	}

	getAllCharacters = async(offset = this._baseOffset) => {
		const res = await this.getResource(
			`${this._apiBase}characters?limit=9&offset=${offset}&${this._apikey}`
		);
		return res.data.results.map(this._transformCharacter);
	}

	getCharacter = async (id) => {
		const res =  await this.getResource(
			`${this._apiBase}characters/${id}?${this._apikey}`
		);
		return this._transformCharacter(res.data.results[0]);
	}

	_transformCharacter = (char) => {
		// let str = char.description;
		// if (str.length > 100) {
		// 	str = str.slice(0, 220)+"...";
		// }
		// if (str.length === 0) {
		// 	str = 'Description is not available for this character'
		// }
		return {
			id: char.id,
			name: char.name,
			description: char.description ? char.description.length > 200 ? char.description.slice (0, 200) +"..." :  char.description:  'Description is not available for this character',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items
		}
	}
}

// all
// https://gateway.marvel.com:443/v1/public/characters?apikey=10877f709e567804be49abd6a4c6cbcd

//limit 9 offset 210
// https://gateway.marvel.com:443/v1/public/characters?limit=9&offset=210&apikey=10877f709e567804be49abd6a4c6cbcd


export default MarvelService;
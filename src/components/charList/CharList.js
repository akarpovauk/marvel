import { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {

	state = {
		charList: [],
		loading: true,
		error: false,
		newItemsLoading: false,
		offset: 210,
		charEnded: false,
		pageEnded: false
	}

	marvelService = new MarvelService();

	componentDidMount() {
		this.pageScrollToTop();
		this.onRequest();
		setTimeout(() => {
			window.addEventListener('scroll', this.onScroll);
		}, 150);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.pageEnded && (this.state.pageEnded !== prevState.pageEnded)) {
			this.onRequest(this.state.offset);
		}
	}

    pageScrollToTop =() => {
		setTimeout(() => { 
			window.scroll({ top: -1, left: 0 });
		}, 100);
	}

	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelService.getAllCharacters(offset)
			.then(this.onCharListLoaded)
			.catch(this.onError)
	}

	onScroll = () => {
		const height = document.documentElement.scrollHeight;
		const clientHeight = document.documentElement.clientHeight;
		const scroll =  window.scrollY;
		if (this.state.charEnded) {
			window.removeEventListener('scroll', this.onScroll);
		}
		if (scroll + clientHeight >= height - 5) {
			this.setState({
				pageEnded: true
			})
		}
	}

	onCharListLoading = () => {
		this.setState({
			newItemsLoading: true
		})
	}

	onCharListLoaded = (newCharList) => {
		let ended = false;
		if(newCharList.length < 9) {
			ended = true;
		}

		this.setState(({charList, offset}) => ({
			charList: [...charList, ...newCharList ],
			loading: false,
			newItemsLoading: false,
			offset: offset + 9,
			charEnded: ended,
			pageEnded: false
		}))
	}

	onError = () => {
		this.setState ({
			loading: false,
			error: true
		})
	}

	itemRefs = [];

	setRef = (ref) => {
		this.itemRefs.push(ref);
	}

	focusOnItem = (id) => {
		this.itemRefs.forEach(item => {
			item.classList.remove('char__item_selected');
		})
		this.itemRefs[id].classList.add('char__item_selected')
		this.itemRefs[id].focus();
	}

	renderItems(arr) {
		const items = arr.map((item, i) => {
			let imgStyle = {'objectFit' : 'cover'};
			if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				imgStyle = {'objectFit' : 'unset'};
			} else if (item.thumbnail.indexOf('.gif') > -1) {
				imgStyle = {'objectFit' : 'contain'};
			}

			return (
				<li className='char__item'
					ref = {this.setRef}
					key = {item.id}
					tabIndex='0'
					onClick={() => {
						this.props.onCharSelected(item.id);
						this.focusOnItem(i);
					}}
					onKeyDown={(e) => {
						if (e.key === ' ') {
							e.preventDefault();
						}
						if (e.key === "Enter" || e.key === ' ') {
							this.props.onCharSelected(item.id);
							this.focusOnItem(i);
						}
					}}>
					<img src={item.thumbnail} 
						alt={item.name}
						style = {imgStyle}
					/>
					<div className="char__name">{item.name}</div>
				</li>
			)
		});

		return (
			<ul className="char__grid">
				{items}
			</ul>
		)
	}

	render () {
		const {charList, loading, error, newItemsLoading, offset, charEnded} = this.state;
		const items = this.renderItems(charList);
		const errorMessage = error ? <ErrorMessage/> : null;
		const spinner = loading? <Spinner/> : null;
		const content = !(loading || error) ? items : null;

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button 
					className="button button__main button__long"
					disabled={newItemsLoading}
					style={{'display': charEnded? "none" : "block"}}
					onClick={() => this.onRequest(offset)}>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;

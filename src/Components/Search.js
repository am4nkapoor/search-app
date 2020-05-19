import React from 'react';
import axios from 'axios';
import Loader from '../loader.gif';

class Search extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			query: '',
			results: [],
			loading: false,
      message: '',
      search: '',
			visible: 6,
			loadmore: false,
    };
    
    this.loadMore = this.loadMore.bind(this) 
		this.cancel = '';
	}

	/**
	 * Fetch the search results and update the state with the result.
	 * Also cancels the previous query before making the new one.
	 *
	 * @param {String} query Search Query.
	 *
	 */
	fetchSearchResults = ( query ) => {

		const searchUrl = `https://api.jikan.moe/v3/search/anime?q=naruto&limit=16`;

		if( this.cancel ) {
			this.cancel.cancel();
		}

		this.cancel = axios.CancelToken.source();

		axios.get( searchUrl, {
			cancelToken: this.cancel.token
		} )
			.then( res => {
				const resultNotFoundMsg = ! res.data.results.length
										? 'There are no more search results.'
										: '';
				this.setState( {
					results: res.data.results,
					message: resultNotFoundMsg,
					loading: false,
					loadmore: false
				} )
			} )
			.catch( error => {
				if ( axios.isCancel(error) || error ) {
					this.setState({
						loading: false,
						message: 'Failed to fetch the data.'
					})
				}
			} )
	};

	handleClick = () => {
		const query = this.state.query;
		if(query){
			this.setState( { loading: true, message: '' }, () => {
				this.fetchSearchResults( 1, query );
			} );
		}
	};

	handleOnInputChange = ( event ) => {
		const query = event.target.value;
		if ( ! query ) {
			this.setState( { query, results: {}, message: '' } );
		} else {
			this.setState( { query }, () => {
			} );
		}
	};

	renderSearchResults = () => {
		const { results } = this.state;

		if ( Object.keys( results ).length && results.length ) {
			return (
				<div className="results-container">
					{ results.slice(0,this.state.visible).map( result => {
						return (
							<a key={ result.mal_id } href={ result.image_url } className="result-item">
								<h6 className="image-username">{result.title}</h6>
								<div className="image-wrapper">
									<img className="image" src={ result.image_url } alt={`${result.title} image`}/>
								</div>
							</a>
						)
					} ) }

				{ this.state.loadmore && results.slice(this.state.visible + 1).map( result => {
						return (
							<a key={ result.mal_id } href={ result.image_url } className="result-item">
								<h6 className="image-username">{result.title}</h6>
								<div className="image-wrapper">
									<img className="image" src={ result.image_url } alt={`${result.title} image`}/>
								</div>
							</a>
						)
					} ) }
				</div>
			)
		}
  };

  loadMore () {
    this.setState({
			loadmore: true,
    })
	}

	render() {
		const { query, loading, message } = this.state;
		return (
			<div className="container">
				{/*	Heading*/}
				<h2 className="heading">Assignment Spinny</h2>
				
				{/* Search Input*/}
				<label className="search-label" htmlFor="search-input">
					<input
						type="text"
						name="query"
						value={ query }
						id="search-input"
						placeholder="search for an anime, e.g Naruto"
						onChange={this.handleOnInputChange}
					/>
				<button className="btn" onClick={this.handleClick}>GO</button>
				</label>

				{/*	Error Message*/}
				{message && <p className="message">{ message }</p>}

				{/*	Loader*/}
				<img src={ Loader } className={`search-loading ${ loading ? 'show' : 'hide' }`} alt="loader"/>

				{/*	Result*/}
				{ this.renderSearchResults() }

				{/*Load More*/}
				{(this.state.results.length > 0 && !this.state.loadmore) && <button onClick={this.loadMore} type="button" className="load-more">Load more</button>} 
			</div>
		)
	}
}

export default Search
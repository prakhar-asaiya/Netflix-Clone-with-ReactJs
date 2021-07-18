import React from 'react'
import './HomeScreen.css'
import NavBar from '../NavBar/NavBar';
import Banner from'../Banner/Banner';
import requests from "../../Requests";
import Row from "../../components/Row/Row";

function HomeScreen() {
    return (
        <div className="homeScreen">
            <NavBar />

            <Banner />
            
            <Row 
                title='NETFLIX ORIGINALS'
                fetchUrl={requests.fetchNetflixOriginals}
                isLargeRow
            />
            <Row 
                title='Trending Now'
                fetchUrl={requests.fetchTrending}
            />
            <Row 
                title='Top Rated'
                fetchUrl={requests.fetchTopRated}
            />
            <Row 
                title='Action Movies'
                fetchUrl={requests.fetchNetflixOriginals}
            />
            <Row 
                title='Comedy Movies'
                fetchUrl={requests.fetchComedyMovies}
            />
            <Row 
                title='Romance Movies'
                fetchUrl={requests.fetchRomancenMovies}
            />
            <Row 
                title='Documentaries'
                fetchUrl={requests.fetchDocumentaries}
            />
        </div>
    );
}

export default HomeScreen

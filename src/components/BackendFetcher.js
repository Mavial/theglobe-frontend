import { request } from 'graphql-request';

export function fetchArticles(country) {
    const query = `{
        allArticles(section: "`+ country + `") {
            edges {
                node {
                    name
                    title
                    section
                }
            }
        }
    }`;

    var response = request('http://127.0.0.1:8000/articles/', query);
    console.log(response);

    return response;
}

export function fetchTopics() {
    return null;
}

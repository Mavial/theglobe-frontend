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

export function fetchAllCountries(setCountries) {
    const query = `{
        allCountries {
            edges {
                node {
                    properties
                    geometry
                }
            }
        }
    }`;

    const modifyData = data => {
        var newObj = {
            features: []
        }
        data.forEach(element => {
            var properties = JSON.parse(element.node.properties)
            var geometry = JSON.parse(element.node.geometry)
            element.node.properties = properties
            element.node.geometry = geometry
            newObj.features.push(element.node)
        })
        // console.log(newObj)
        // console.log(typeof newObj.features[0])
        return newObj
    }

    var res = request('http://127.0.0.1:8000/articles/', query).then(data => setCountries(modifyData(data.allCountries.edges)));

    return res
    // var country_list = response.data.allCountries.edges
    // console.log(response);
    // for (i in country_list) {console.log(country_list[i])};
}

export function fetchTopics() {
    return null;
}

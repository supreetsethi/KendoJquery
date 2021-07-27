var custom = {
    location: window.location.host,
    openPage(route) {

        window.location = window.location.protocol + "//" + window.location.host + route
    }
}
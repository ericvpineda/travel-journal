// JS utilities file  

// Used for travel post time last updated 
const pageLastUpdated = (date) => {
    const prevDate = new Date(date);
    const presDate = new Date();
    let seconds = Math.floor((presDate - prevDate) / 1000);
    
    if (seconds >= 31536000) {
        return Math.floor(seconds / 31536000) + " years";
    } else if (seconds >= 2628288) {
        return Math.floor(seconds / 2628288) + " months";
    } else if (seconds >= 604800) {
        return Math.floor(seconds / 604800) + " weeks";
    } else if (seconds >= 86400) {
        return Math.floor(seconds / 86400) + " days";
    } else if (seconds >= 3600) {
        return Math.floor(seconds / 3600) + " days";
    } else if (seconds >= 60) {
        return Math.floor(seconds / 60) + " minutes";
    } 
    return seconds + " seconds";
}

module.exports = {pageLastUpdated};
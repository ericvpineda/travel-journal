// Wrapper function to catch any async errors from route functions 

function catchAsync(func) {
    return function (req, res, next) {
        func(req, res, next).catch(next);
    }
}

module.exports = catchAsync;
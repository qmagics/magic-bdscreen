/** 延迟 */
exports.sleep = (wait) => {
    return new Promise((resolve) => {
        setTimeout(resolve, wait);
    });
}
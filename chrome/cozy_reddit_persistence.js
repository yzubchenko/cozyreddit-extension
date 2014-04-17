/**
 * INSTRUCTIONS:
 * Sorry, because of Terms of Service, I can't make storage API requests public,
 * but you can use your storage to keep extension data.
 * Therefore you need to implement some functions with requests to your storage.
 * This file presents a stub for functions, which you need to implement.
 * For each function, a detailed description has been written.
 *
 * As storage you can use eg.: parse.com, firebase.com or some other.
 *
 * NOTE:
 * If you want to use any additional scripts, you should add them to [manifest.json]
 */
CozyRedditPersistence = {
    redditUserName : null,

    init: function (redditUserName, callback) {
        CozyRedditPersistence.redditUserName = redditUserName;
        /**
         * ...
         * initialize here your persistence api
         * ...
         */
        if (typeof callback == 'function') {
            callback();
        }
    },


    /**
     * function send username request to your storage, and call success on error function
     * @param onSuccess function without args; calls if user data contains in storage or user has successfully created in there.
     * @param onError function without args; calls if user request error.
     */
    requestRedditUser: function (onSuccess, onError) {
        /**
         * do username request here
         * use [CozyRedditPersistence.redditUserName] and do query from your storage
         */
    },

    /**
     * function saves post's last update data to storage
     * @param postId post identifier (String) Example: "cc-012abc"
     * @param lastUpdate last update data (String) Example: "1397736554630,6" - timestamp ang comments count
     */
    setPostLastUpdate: function (postId, lastUpdate) {
        /**
         * send post's last update request to storage - use [CozyRedditPersistence.redditUserName] and [postId] for query.
         * if post is not contains in storage, create post and bind [CozyRedditPersistence.redditUserName] and [postId] there
         * set lastUpdate data
         * save data to storage
         */
    },

    /**
     * function requests post's last update data from storage and write it into response
     * @param postId postId post identifier (String) Example: "cc-012abc"
     * @param response function with 1 required arg. Arg is String with last update data. Example: "1397736554630,6" - timestamp ang comments count
     */
    requestPostLastUpdate: function (postId, response) {
        /**
         * do post's last update request to your storage - use [CozyRedditPersistence.redditUserName] and [postId] for query.
         * if post contains in storage, write last update data to response
         * else write null to response
         */
    },

    /**
     * function requests posts by they identifiers from  storage and write response with found posts
     * @param postIdArr array with post identifiers (Array) Example: [cc-012abc, cc-345def, cc-678xxx]
     * @param response function with 1 required arg. Arg is Array with found posts. Post is array of 2 items: [0] - post identifier, [1] - last update data
     *        Example: [["cc-012abc", "1397736554630,6"], ["cc-345def", "12345675674,23"]]
     */
    requestPosts: function (postIdArr, response) {
        /**
         * do post request to your storage here - use [CozyRedditPersistence.redditUserName] and [postIdArr] for query.
         * query result must return array of found posts
         * if result array length > 0, write array to response
         * else write null to response
         */
    }
};
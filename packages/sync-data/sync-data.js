// Write your package code here!


var SyncQueue = Collections.SyncQueue;


sJobCollections = (function () {
    return {
        registerJobs: function (name, jobProcessing, options) {
            if (typeof name !== 'string' || typeof jobProcessing !== 'function') return false;

            return SyncQueue.processJobs(name, options, jobProcessing);
        },
        addJobtoQueue: function (type, data) {
            if (typeof type !== 'string') return false;
            return Job(SyncQueue, type, data).save();
        }
    }
})();